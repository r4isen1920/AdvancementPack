import { EquipmentSlot, GameMode, Player } from "@minecraft/server";
import PlayerData, { TrackedCategory } from "./PlayerData";



//#region Types

/** Base interface for all criteria */
export interface ICriteria {
    /** Evaluates if the criterion is met for the given player */
    evaluate(player: Player): boolean;
    /** Unique type identifier for serialization */
    readonly type: string;
}



//#region Base Criteria

/**
 * Base class for all criteria. Provides common functionality.
 */
export abstract class BaseCriteria implements ICriteria {
    abstract readonly type: string;
    abstract evaluate(player: Player): boolean;
}

/**
 * Custom criteria using a callback function.
 * Use for complex logic that can't be expressed with other criteria types.
 */
export class FunctionCriteria extends BaseCriteria {
    readonly type = "function";
    private readonly fn: (player: Player) => boolean;

    constructor(fn: (player: Player) => boolean) {
        super();
        this.fn = fn;
    }

    evaluate(player: Player): boolean {
        return this.fn(player);
    }
}



//#region Inventory Criteria

/**
 * Checks if player has a specific item in their inventory.
 */
export class HasItemCriteria extends BaseCriteria {
    readonly type = "has_item";
    private readonly itemId: string;
    private readonly minCount: number;

    constructor(itemId: string, minCount: number = 1) {
        super();
        this.itemId = itemId;
        this.minCount = minCount;
    }

    evaluate(player: Player): boolean {
        const inventory = player.getComponent("inventory");
        if (!inventory) return false;

        const container = inventory.container;
        if (!container) return false;

        let count = 0;
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (item?.typeId === this.itemId) {
                count += item.amount;
                if (count >= this.minCount) return true;
            }
        }
        return false;
    }
}

/**
 * Checks if player has any item matching a pattern.
 */
export class HasItemMatchingCriteria extends BaseCriteria {
    readonly type = "has_item_matching";
    private readonly pattern: string | RegExp;

    constructor(pattern: string | RegExp) {
        super();
        this.pattern = pattern;
    }

    evaluate(player: Player): boolean {
        const inventory = player.getComponent("inventory");
        if (!inventory) return false;

        const container = inventory.container;
        if (!container) return false;

        const regex = typeof this.pattern === "string" 
            ? new RegExp(this.pattern) 
            : this.pattern;

        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (item && regex.test(item.typeId)) {
                return true;
            }
        }
        return false;
    }
}

/**
 * Checks if player is holding a specific item.
 */
export class HoldingItemCriteria extends BaseCriteria {
    readonly type = "holding_item";
    private readonly itemId: string;
    private readonly offhand: boolean;

    constructor(itemId: string, offhand: boolean = false) {
        super();
        this.itemId = itemId;
        this.offhand = offhand;
    }

    evaluate(player: Player): boolean {
        if (this.offhand) {
            const equip = player.getComponent("equippable");
            if (!equip) return false;
            const item = equip.getEquipment(EquipmentSlot.Offhand);
            return item?.typeId === this.itemId;
        }

        const inventory = player.getComponent("inventory");
        if (!inventory) return false;
        const item = inventory.container?.getItem(player.selectedSlotIndex);
        return item?.typeId === this.itemId;
    }
}



//#region Tracked Data Criteria

/**
 * Checks if player has tracked a specific item in a category.
 */
export class HasTrackedCriteria extends BaseCriteria {
    readonly type = "has_tracked";
    private readonly category: TrackedCategory;
    private readonly item: string;

    constructor(category: TrackedCategory, item: string) {
        super();
        this.category = category;
        this.item = item;
    }

    evaluate(player: Player): boolean {
        return PlayerData.hasTracked(player, this.category, this.item);
    }
}

/**
 * Checks if player has tracked all items in a list.
 */
export class HasAllTrackedCriteria extends BaseCriteria {
    readonly type = "has_all_tracked";
    private readonly category: TrackedCategory;
    private readonly items: readonly string[];

    constructor(category: TrackedCategory, items: readonly string[]) {
        super();
        this.category = category;
        this.items = items;
    }

    evaluate(player: Player): boolean {
        return PlayerData.hasAll(player, this.category, this.items);
    }
}

/**
 * Checks if player has tracked any items in a list.
 */
export class HasAnyTrackedCriteria extends BaseCriteria {
    readonly type = "has_any_tracked";
    private readonly category: TrackedCategory;
    private readonly items: readonly string[];

    constructor(category: TrackedCategory, items: readonly string[]) {
        super();
        this.category = category;
        this.items = items;
    }

    evaluate(player: Player): boolean {
        return PlayerData.hasAny(player, this.category, this.items);
    }
}

/**
 * Checks if player has tracked at least N items in a category.
 */
export class HasTrackedCountCriteria extends BaseCriteria {
    readonly type = "has_tracked_count";
    private readonly category: TrackedCategory;
    private readonly minCount: number;

    constructor(category: TrackedCategory, minCount: number) {
        super();
        this.category = category;
        this.minCount = minCount;
    }

    evaluate(player: Player): boolean {
        return PlayerData.getTrackedCount(player, this.category) >= this.minCount;
    }
}



//#region Location Criteria

/**
 * Checks if player is in a specific dimension.
 */
export class InDimensionCriteria extends BaseCriteria {
    readonly type = "in_dimension";
    private readonly dimensionId: string;

    constructor(dimensionId: string) {
        super();
        this.dimensionId = dimensionId;
    }

    evaluate(player: Player): boolean {
        return player.dimension.id === this.dimensionId;
    }
}

/**
 * Checks if player is at a specific Y level range.
 */
export class AtYLevelCriteria extends BaseCriteria {
    readonly type = "at_y_level";
    private readonly minY: number;
    private readonly maxY: number;

    constructor(minY: number, maxY: number = Infinity) {
        super();
        this.minY = minY;
        this.maxY = maxY;
    }

    evaluate(player: Player): boolean {
        const y = player.location.y;
        return y >= this.minY && y <= this.maxY;
    }
}

/**
 * Checks if player is in a specific biome.
 */
export class InBiomeCriteria extends BaseCriteria {
    readonly type = "in_biome";
    private readonly biomeId: string;

    constructor(biomeId: string) {
        super();
        this.biomeId = biomeId;
    }

    evaluate(player: Player): boolean {
        const currentBiome = PlayerData.getMisc<string>(player, "currentBiome");
        return currentBiome === this.biomeId;
    }
}



//#region Equipment Criteria

/**
 * Checks if player has specific armor equipped.
 */
export class HasArmorCriteria extends BaseCriteria {
    readonly type = "has_armor";
    private readonly slot: EquipmentSlot;
    private readonly itemId: string;

    constructor(slot: EquipmentSlot, itemId: string) {
        super();
        this.slot = slot;
        this.itemId = itemId;
    }

    evaluate(player: Player): boolean {
        const equip = player.getComponent("equippable");
        if (!equip) return false;
        const item = equip.getEquipment(this.slot);
        return item?.typeId === this.itemId;
    }
}

/**
 * Checks if player has full armor set of a material.
 */
export class HasFullArmorSetCriteria extends BaseCriteria {
    readonly type = "has_full_armor_set";
    private readonly material: string;

    constructor(material: string) {
        super();
        this.material = material;
    }

    evaluate(player: Player): boolean {
        const equip = player.getComponent("equippable");
        if (!equip) return false;

        const slots: EquipmentSlot[] = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
        const suffixes = ["helmet", "chestplate", "leggings", "boots"];

        for (let i = 0; i < slots.length; i++) {
            const item = equip.getEquipment(slots[i]);
            const expected = `minecraft:${this.material}_${suffixes[i]}`;
            if (item?.typeId !== expected) return false;
        }
        return true;
    }
}



//#region Effect Criteria

/**
 * Checks if player has a specific effect.
 */
export class HasEffectCriteria extends BaseCriteria {
    readonly type = "has_effect";
    private readonly effectId: string;
    private readonly minAmplifier: number;

    constructor(effectId: string, minAmplifier: number = 0) {
        super();
        this.effectId = effectId;
        this.minAmplifier = minAmplifier;
    }

    evaluate(player: Player): boolean {
        const effect = player.getEffect(this.effectId);
        if (!effect) return false;
        return effect.amplifier >= this.minAmplifier;
    }
}

/**
 * Checks if player has all specified effects.
 */
export class HasAllEffectsCriteria extends BaseCriteria {
    readonly type = "has_all_effects";
    private readonly effectIds: readonly string[];

    constructor(effectIds: readonly string[]) {
        super();
        this.effectIds = effectIds;
    }

    evaluate(player: Player): boolean {
        return this.effectIds.every(id => player.getEffect(id) !== undefined);
    }
}



//#region State Criteria

/**
 * Checks if player is riding an entity.
 */
export class IsRidingCriteria extends BaseCriteria {
    readonly type = "is_riding";
    private readonly entityTypeId?: string;

    constructor(entityTypeId?: string) {
        super();
        this.entityTypeId = entityTypeId;
    }

    evaluate(player: Player): boolean {
        const riding = player.getComponent("riding");
        if (!riding?.entityRidingOn) return false;
        if (this.entityTypeId) {
            return riding.entityRidingOn.typeId === this.entityTypeId;
        }
        return true;
    }
}

/**
 * Checks if player matches game mode.
 */
export class GameModeCriteria extends BaseCriteria {
    readonly type = "game_mode";
    private readonly gameMode: GameMode;

    constructor(gameMode: GameMode) {
        super();
        this.gameMode = gameMode;
    }

    evaluate(player: Player): boolean {
        return player.getGameMode() === this.gameMode;
    }
}



//#region Composite Criteria

/**
 * All criteria must pass (AND logic).
 */
export class AllCriteria extends BaseCriteria {
    readonly type = "all";
    private readonly criteria: ICriteria[];

    constructor(...criteria: ICriteria[]) {
        super();
        this.criteria = criteria;
    }

    evaluate(player: Player): boolean {
        return this.criteria.every(c => c.evaluate(player));
    }
}

/**
 * Any criteria must pass (OR logic).
 */
export class AnyCriteria extends BaseCriteria {
    readonly type = "any";
    private readonly criteria: ICriteria[];

    constructor(...criteria: ICriteria[]) {
        super();
        this.criteria = criteria;
    }

    evaluate(player: Player): boolean {
        return this.criteria.some(c => c.evaluate(player));
    }
}

/**
 * Inverts the result of a criteria (NOT logic).
 */
export class NotCriteria extends BaseCriteria {
    readonly type = "not";
    private readonly criteria: ICriteria;

    constructor(criteria: ICriteria) {
        super();
        this.criteria = criteria;
    }

    evaluate(player: Player): boolean {
        return !this.criteria.evaluate(player);
    }
}



//#region Factory Helpers

/** Helper functions for creating common criteria */
const Criteria = {
    /** Creates a custom function-based criteria */
    fn: (fn: (player: Player) => boolean) => new FunctionCriteria(fn),
    
    /** Creates a "has item" criteria */
    hasItem: (itemId: string, minCount?: number) => new HasItemCriteria(itemId, minCount),
    
    /** Creates a "has item matching pattern" criteria */
    hasItemMatching: (pattern: string | RegExp) => new HasItemMatchingCriteria(pattern),
    
    /** Creates a "holding item" criteria */
    holdingItem: (itemId: string, offhand?: boolean) => new HoldingItemCriteria(itemId, offhand),
    
    /** Creates a "has tracked" criteria */
    hasTracked: (category: TrackedCategory, item: string) => new HasTrackedCriteria(category, item),
    
    /** Creates a "has all tracked" criteria */
    hasAllTracked: (category: TrackedCategory, items: readonly string[]) => new HasAllTrackedCriteria(category, items),
    
    /** Creates a "has any tracked" criteria */
    hasAnyTracked: (category: TrackedCategory, items: readonly string[]) => new HasAnyTrackedCriteria(category, items),
    
    /** Creates a "has tracked count" criteria */
    hasTrackedCount: (category: TrackedCategory, minCount: number) => new HasTrackedCountCriteria(category, minCount),
    
    /** Creates an "in dimension" criteria */
    inDimension: (dimensionId: string) => new InDimensionCriteria(dimensionId),
    
    /** Creates an "at Y level" criteria */
    atYLevel: (minY: number, maxY?: number) => new AtYLevelCriteria(minY, maxY),
    
    /** Creates an "in biome" criteria */
    inBiome: (biomeId: string) => new InBiomeCriteria(biomeId),
    
    /** Creates a "has armor" criteria */
    hasArmor: (slot: EquipmentSlot, itemId: string) => new HasArmorCriteria(slot, itemId),
    
    /** Creates a "has full armor set" criteria */
    hasFullArmorSet: (material: string) => new HasFullArmorSetCriteria(material),
    
    /** Creates a "has effect" criteria */
    hasEffect: (effectId: string, minAmplifier?: number) => new HasEffectCriteria(effectId, minAmplifier),
    
    /** Creates a "has all effects" criteria */
    hasAllEffects: (effectIds: readonly string[]) => new HasAllEffectsCriteria(effectIds),
    
    /** Creates an "is riding" criteria */
    isRiding: (entityTypeId?: string) => new IsRidingCriteria(entityTypeId),
    
    /** Creates a "game mode" criteria */
    gameMode: (mode: GameMode) => new GameModeCriteria(mode),
    
    /** Combines criteria with AND logic */
    all: (...criteria: ICriteria[]) => new AllCriteria(...criteria),
    
    /** Combines criteria with OR logic */
    any: (...criteria: ICriteria[]) => new AnyCriteria(...criteria),
    
    /** Inverts a criteria */
    not: (criteria: ICriteria) => new NotCriteria(criteria),
};

export default Criteria;
