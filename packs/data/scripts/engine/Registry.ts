import { Logger } from "@bedrock-oss/bedrock-boost";
import Advancement, { AdvancementTab } from "./Advancement";
import { Player, world, system } from "@minecraft/server";
import { NAMESPACE } from "../utils/Namespace";
import EventBus from "./EventBus";



//#region Types

/** Player unlock state */
interface PlayerUnlockState {
    unlocked: Set<string>;
    evaluated: boolean;
}



//#region Main

/**
 * Central registry for all advancements.
 * Handles registration, lookup, unlock tracking, and persistence.
 */
export default class Registry {
    private static readonly log = Logger.getLogger("Registry");
    
    /** All registered advancements by ID */
    private static readonly advancements: Map<string, Advancement> = new Map();
    
    /** Advancements grouped by tab */
    private static readonly byTab: Map<AdvancementTab, Set<Advancement>> = new Map();
    
    /** Player unlock states (cached) */
    private static readonly playerStates: Map<string, PlayerUnlockState> = new Map();
    
    /** Dirty players that need saving */
    private static readonly dirtyPlayers: Set<string> = new Set();
    
    /** Evaluation interval in ticks */
    private static readonly EVAL_INTERVAL = 5;
    
    /** Auto-save interval in ticks */
    private static readonly SAVE_INTERVAL = 100;



    //#region Registration

    /**
     * Registers an advancement.
     */
    static register(advancement: Advancement): void {
        if (this.advancements.has(advancement.id)) {
            this.log.warn(`Duplicate advancement ID: ${advancement.id}`);
            return;
        }

        this.advancements.set(advancement.id, advancement);
        
        // Add to tab grouping
        let tabSet = this.byTab.get(advancement.tab);
        if (!tabSet) {
            tabSet = new Set();
            this.byTab.set(advancement.tab, tabSet);
        }
        tabSet.add(advancement);

        this.log.debug(`Registered: ${advancement.id} (tab: ${advancement.tab})`);
    }

    /**
     * Gets an advancement by ID.
     */
    static get(id: string): Advancement | undefined {
        return this.advancements.get(id);
    }

    /**
     * Gets all registered advancements.
     */
    static getAll(): Iterable<Advancement> {
        return this.advancements.values();
    }

    /**
     * Gets advancements for a specific tab.
     */
    static getByTab(tab: AdvancementTab): ReadonlySet<Advancement> {
        return this.byTab.get(tab) ?? new Set();
    }

    /**
     * Gets total count of registered advancements.
     */
    static get count(): number {
        return this.advancements.size;
    }



    //#region Unlock State

    /**
     * Checks if an advancement is unlocked for a player.
     */
    static isUnlocked(id: string, player: Player): boolean {
        const state = this.getOrLoadState(player);
        return state.unlocked.has(id);
    }

    /**
     * Marks an advancement as unlocked (internal use).
     */
    static markUnlocked(id: string, player: Player): void {
        const state = this.getOrLoadState(player);
        state.unlocked.add(id);
        this.dirtyPlayers.add(player.id);
    }

    /**
     * Marks an advancement as locked (internal use).
     */
    static markLocked(id: string, player: Player): void {
        const state = this.getOrLoadState(player);
        state.unlocked.delete(id);
        this.dirtyPlayers.add(player.id);
    }

    /**
     * Gets unlocked advancements for a player in a tab.
     */
    static getUnlockedInTab(player: Player, tab: AdvancementTab): Advancement[] {
        const tabAdvancements = this.byTab.get(tab);
        if (!tabAdvancements) return [];

        const state = this.getOrLoadState(player);
        return Array.from(tabAdvancements).filter(adv => state.unlocked.has(adv.id));
    }

    /**
     * Gets unlock count for a player.
     */
    static getUnlockCount(player: Player): number {
        const state = this.getOrLoadState(player);
        return state.unlocked.size;
    }



    //#region Evaluation

    /**
     * Evaluates all locked advancements for a player.
     */
    static evaluateFor(player: Player): void {
        const state = this.getOrLoadState(player);
        
        for (const advancement of this.advancements.values()) {
            if (state.unlocked.has(advancement.id)) continue;
            
            try {
                if (advancement.canUnlock(player)) {
                    advancement.unlock(player);
                }
            } catch (e) {
                this.log.error(`Evaluation error for ${advancement.id}: ${e}`);
            }
        }
    }

    /**
     * Evaluates all players.
     */
    static evaluateAll(): void {
        for (const player of world.getAllPlayers()) {
            this.evaluateFor(player);
        }
    }



    //#region Persistence

    /**
     * Loads player state from dynamic properties.
     */
    private static loadState(player: Player): PlayerUnlockState {
        const state: PlayerUnlockState = {
            unlocked: new Set(),
            evaluated: false,
        };

        // Load from individual advancement properties
        for (const id of this.advancements.keys()) {
            const propKey = `${NAMESPACE}:adv.${id}`;
            if (player.getDynamicProperty(propKey) === true) {
                state.unlocked.add(id);
            }
        }

        this.log.debug(`Loaded ${state.unlocked.size} unlocks for ${player.name}`);
        return state;
    }

    /**
     * Saves player state to dynamic properties.
     */
    static savePlayer(player: Player): void {
        if (!this.dirtyPlayers.has(player.id)) return;
        
        // Individual properties are already set during unlock
        // This is just for cleanup
        this.dirtyPlayers.delete(player.id);
        this.log.debug(`Saved state for ${player.name}`);
    }

    /**
     * Saves all dirty players.
     */
    static saveAll(): void {
        for (const player of world.getAllPlayers()) {
            this.savePlayer(player);
        }
    }

    /**
     * Unloads player state (on leave).
     */
    static unloadPlayer(player: Player): void {
        this.savePlayer(player);
        this.playerStates.delete(player.id);
    }

    /**
     * Resets all progress for a player.
     */
    static resetPlayer(player: Player): void {
        const state = this.getOrLoadState(player);
        
        for (const id of state.unlocked) {
            player.setDynamicProperty(`${NAMESPACE}:adv.${id}`, undefined);
        }
        
        state.unlocked.clear();
        this.dirtyPlayers.delete(player.id);
        this.log.info(`Reset all progress for ${player.name}`);
    }



    //#region Internal

    private static getOrLoadState(player: Player): PlayerUnlockState {
        let state = this.playerStates.get(player.id);
        if (!state) {
            state = this.loadState(player);
            this.playerStates.set(player.id, state);
        }
        return state;
    }



    //#region Initialization

    /**
     * Initializes the registry tick handlers.
     */
    static init(): void {
        // Periodic evaluation
        EventBus.onTick(() => {
            this.evaluateAll();
        }, this.EVAL_INTERVAL);

        // Periodic save
        EventBus.onTick(() => {
            this.saveAll();
        }, this.SAVE_INTERVAL);

        // Player leave cleanup
        EventBus.on("playerSpawn", ({ player, initialSpawn }) => {
            if (initialSpawn) {
                this.getOrLoadState(player);
            }
        });

        this.log.info(`Initialized with ${this.advancements.size} advancements`);
    }
}

Registry.init();
