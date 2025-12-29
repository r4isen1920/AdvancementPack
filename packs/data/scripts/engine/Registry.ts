import { Logger } from "@bedrock-oss/bedrock-boost";
import Advancement, { AdvancementTab } from "./Advancement";
import { Player, world, system } from "@minecraft/server";
import { NAMESPACE } from "../utils/Namespace";
import EventBus from "./EventBus";
import PlayerHandler from "../handlers/PlayerHandler";
import PlayerData, { TrackedCategory } from "./PlayerData";



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
    /** Advancements tab groups */
    private static readonly tabs: Map<AdvancementTab, Set<Advancement>> = new Map();

    private static readonly EVAL_INTERVAL = 10;


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
        let tabSet = this.tabs.get(advancement.tab);
        if (!tabSet) {
            tabSet = new Set();
            this.tabs.set(advancement.tab, tabSet);
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
        return this.tabs.get(tab) ?? new Set();
    }

    /**
     * Gets total count of registered advancements.
     */
    static get count(): number {
        return this.advancements.size;
    }



    //#region Evaluation

    /**
     * Evaluates all locked advancements for a player.
     */
    static evaluateFor(player: Player): void {
        const state = PlayerData.getTracked(player, TrackedCategory.UnlockedAdvancement);
        
        for (const advancement of this.advancements.values()) {
            if (state.has(advancement.id)) continue;
            
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
        for (const player of PlayerHandler.getOnlinePlayers()) {
            this.evaluateFor(player);
        }
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

        this.log.info(`Initialized with ${this.advancements.size} advancements`);
    }
}

