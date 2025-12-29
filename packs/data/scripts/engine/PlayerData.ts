import { Player, world } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import { NAMESPACE } from "../utils/Namespace";
import PlayerHandler from "../handlers/PlayerHandler";
import Advancement from "./Advancement";



//#region Types

/** Categories of tracked data for players */
export enum TrackedCategory {
    Biome = "biome",
    Breed = "breed",
    Consumed = "consumed",
    Killed = "killed",
    Tamed = "tamed",
    Riding = "riding",
    CrossbowHit = "crossbow_hit",
    UnlockedAdvancement = "unlockedAdvancement",
}

/** Data structure for player tracking info */
interface PlayerTrackedData {
    biomes: Set<string>;
    breeds: Set<string>;
    consumed: Set<string>;
    killed: Set<string>;
    tamed: Set<string>;
    riding: Set<string>;
    crossbowHits: Set<string>;
    unlockedAdvancement: Set<string>;
    misc: Map<string, unknown>;
}

/** Serializable format for player data */
interface SerializedPlayerData {
    biomes: string[];
    breeds: string[];
    consumed: string[];
    killed: string[];
    tamed: string[];
    riding: string[];
    crossbowHits: string[];
    unlocked: string[];
    misc: Record<string, unknown>;
}



//#region Main

/**
 * Manages player-specific data using dynamic properties.
 * Replaces the tag-based system with a more efficient and type-safe approach.
 */
export default class PlayerData {
    private static readonly log = Logger.getLogger("PlayerData");
    private static readonly PROPERTY_KEY = `${NAMESPACE}:player_data`;
    private static readonly MAX_PROPERTY_SIZE = 32767;

    /** In-memory cache of player data */
    private static readonly cache: Map<string, PlayerTrackedData> = new Map();

    /** Dirty flag for players that need to be saved */
    private static readonly dirty: Set<string> = new Set();



    //#region API - Getters

    /**
     * Gets all tracked items in a category for a player.
     */
    static getTracked(player: Player, category: TrackedCategory): ReadonlySet<string> {
        const data = this.get(player);
        return this.getCategorySet(data, category);
    }

    /**
     * Checks if a player has tracked a specific item in a category.
     */
    static hasTracked(player: Player, category: TrackedCategory, item: string): boolean {
        const data = this.get(player);
        return this.getCategorySet(data, category).has(item);
    }

    /**
     * Gets the count of tracked items in a category.
     */
    static getTrackedCount(player: Player, category: TrackedCategory): number {
        const data = this.get(player);
        return this.getCategorySet(data, category).size;
    }

    /**
     * Gets a misc property value for a player.
     */
    static getMisc<T>(player: Player, key: string): T | undefined {
        const data = this.get(player);
        return data.misc.get(key) as T | undefined;
    }



    //#region API - Setters

    /**
     * Tracks an item in a category for a player.
     * @returns true if newly added, false if already tracked
     */
    static track(player: Player, category: TrackedCategory, item: string): boolean {
        const data = this.get(player);
        const set = this.getCategorySet(data, category);
        
        if (set.has(item)) return false;
        
        set.add(item);
        this.markDirty(player);
        this.log.debug(`Tracked ${item} [${category}], for: ${player.name}`);
        return true;
    }

    /**
     * Untracks an item in a category for a player.
     * @returns true if removed, false if wasn't tracked
     */
    static untrack(player: Player, category: TrackedCategory, item: string): boolean {
        const data = this.get(player);
        const set = this.getCategorySet(data, category);
        
        if (!set.has(item)) return false;
        
        set.delete(item);
        this.markDirty(player);
        return true;
    }

    /**
     * Clears all tracked items in a category for a player.
     */
    static clearCategory(player: Player, category: TrackedCategory): void {
        const data = this.get(player);
        const set = this.getCategorySet(data, category);
        set.clear();
        this.markDirty(player);
    }

    /**
     * Sets a misc property value for a player.
     */
    static setMisc<T>(player: Player, key: string, value: T): void {
        const data = this.get(player);
        data.misc.set(key, value);
        this.markDirty(player);
    }

    /**
     * Clears a misc property for a player.
     */
    static clearMisc(player: Player, key: string): void {
        const data = this.get(player);
        data.misc.delete(key);
        this.markDirty(player);
    }



    //#region API - Bulk Operations

    /**
     * Resets all tracked data for a player.
     */
    static resetAll(player: Player): void {
        const data = this.createEmptyData();
        this.cache.set(player.id, data);
        this.markDirty(player);
        this.log.info(`Reset all data for ${player.name}`);
    }

    /**
     * Checks if a player has all items in a category.
     */
    static hasAll(player: Player, category: TrackedCategory, items: readonly string[]): boolean {
        const data = this.get(player);
        const set = this.getCategorySet(data, category);
        return items.every(item => set.has(item));
    }

    /**
     * Checks if a player has any items in a category.
     */
    static hasAny(player: Player, category: TrackedCategory, items: readonly string[]): boolean {
        const data = this.get(player);
        const set = this.getCategorySet(data, category);
        return items.some(item => set.has(item));
    }



    //#region Persistence

    /**
     * Loads player data from dynamic properties.
     */
    static load(player: Player): void {
        try {
            let json = "";
            let i = 0;
            let chunk = player.getDynamicProperty(`${this.PROPERTY_KEY}_${i}`);
            
            if (typeof chunk === "string") {
                while (typeof chunk === "string") {
                    json += chunk;
                    i++;
                    chunk = player.getDynamicProperty(`${this.PROPERTY_KEY}_${i}`);
                }
            }

            if (!json) {
                this.cache.set(player.id, this.createEmptyData());
                return;
            }

            const parsed: SerializedPlayerData = JSON.parse(json);
            const data: PlayerTrackedData = {
                biomes: new Set(parsed.biomes ?? []),
                breeds: new Set(parsed.breeds ?? []),
                consumed: new Set(parsed.consumed ?? []),
                killed: new Set(parsed.killed ?? []),
                tamed: new Set(parsed.tamed ?? []),
                riding: new Set(parsed.riding ?? []),
                crossbowHits: new Set(parsed.crossbowHits ?? []),
                unlockedAdvancement: new Set(parsed.unlocked ?? []),
                misc: new Map(Object.entries(parsed.misc ?? {})),
            };
            
            this.cache.set(player.id, data);
            this.log.debug(`Loaded data for ${player.name}`);
        } catch (e) {
            this.log.warn(`Failed to load data for ${player.name}: ${e}`);
            this.cache.set(player.id, this.createEmptyData());
        }
    }

    /**
     * Saves player data to dynamic properties.
     */
    static save(player: Player): void {
        if (!this.dirty.has(player.id)) return;
        
        try {
            const data = this.cache.get(player.id);
            if (!data) return;

            const serialized: SerializedPlayerData = {
                biomes: Array.from(data.biomes),
                breeds: Array.from(data.breeds),
                consumed: Array.from(data.consumed),
                killed: Array.from(data.killed),
                tamed: Array.from(data.tamed),
                riding: Array.from(data.riding),
                crossbowHits: Array.from(data.crossbowHits),
                unlocked: Array.from(data.unlockedAdvancement),
                misc: Object.fromEntries(data.misc),
            };

            const json = JSON.stringify(serialized);
            
            const chunkCount = Math.ceil(json.length / this.MAX_PROPERTY_SIZE);
            for (let i = 0; i < chunkCount; i++) {
                const chunk = json.substring(i * this.MAX_PROPERTY_SIZE, (i + 1) * this.MAX_PROPERTY_SIZE);
                player.setDynamicProperty(`${this.PROPERTY_KEY}_${i}`, chunk);
            }
            let i = chunkCount;
            while (player.getDynamicProperty(`${this.PROPERTY_KEY}_${i}`) !== undefined) {
                player.setDynamicProperty(`${this.PROPERTY_KEY}_${i}`, undefined);
                i++;
            }
            if (player.getDynamicProperty(this.PROPERTY_KEY) !== undefined) {
                player.setDynamicProperty(this.PROPERTY_KEY, undefined);
            }

            this.dirty.delete(player.id);
            this.log.debug(`Saved data for ${player.name}`);
        } catch (e) {
            this.log.error(`Failed to save data for ${player.name}: ${e}`);
        }
    }

    /**
     * Saves all dirty player data.
     */
    static saveAll(): void {
        for (const player of PlayerHandler.getOnlinePlayers()) {
            if (this.dirty.has(player.id)) {
                this.save(player);
            }
        }
    }

    /**
     * Unloads player data from cache (call on player leave).
     */
    static unload(player: Player): void {
        this.save(player);
        this.cache.delete(player.id);
        this.dirty.delete(player.id);
    }



    //#region Internal

    private static get(player: Player): PlayerTrackedData {
        let data = this.cache.get(player.id);
        if (!data) {
            this.load(player);
            data = this.cache.get(player.id)!;
        }
        return data;
    }

    private static createEmptyData(): PlayerTrackedData {
        return {
            biomes: new Set(),
            breeds: new Set(),
            consumed: new Set(),
            killed: new Set(),
            tamed: new Set(),
            riding: new Set(),
            crossbowHits: new Set(),
            unlockedAdvancement: new Set(),
            misc: new Map(),
        };
    }

    private static getCategorySet(data: PlayerTrackedData, category: TrackedCategory): Set<string> {
        switch (category) {
            case TrackedCategory.Biome: return data.biomes;
            case TrackedCategory.Breed: return data.breeds;
            case TrackedCategory.Consumed: return data.consumed;
            case TrackedCategory.Killed: return data.killed;
            case TrackedCategory.Tamed: return data.tamed;
            case TrackedCategory.Riding: return data.riding;
            case TrackedCategory.CrossbowHit: return data.crossbowHits;
            case TrackedCategory.UnlockedAdvancement: return data.unlockedAdvancement;
        }
    }

    private static markDirty(player: Player): void {
        this.dirty.add(player.id);
    }
}
