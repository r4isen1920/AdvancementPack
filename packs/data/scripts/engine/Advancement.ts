import { GameMode, Player } from "@minecraft/server";
import { ICriteria } from "./Criteria";
import Registry from "./Registry";
import { NAMESPACE } from "../utils/Namespace";
import Toast from "./Toast";
import { Logger } from "@bedrock-oss/bedrock-boost";



//#region Types

/**
 * Type of advancement, affects visual display.
 */
export enum AdvancementType {
    /** Entry point advancement (story root) */
    ENTRY = "entry",
    /** Legacy achievement style (yellow header) */
    ACHIEVEMENT = "achievement",
    /** Standard advancement (yellow header) */
    ADVANCEMENT = "advancement",
    /** Challenge advancement (purple header) */
    CHALLENGE = "challenge",
    /** Goal advancement (yellow header) */
    GOAL = "goal",
}

/**
 * Tab category for advancements.
 */
export enum AdvancementTab {
    ACHIEVEMENTS = "achievements",
    ADVENTURE = "adventure",
    HUSBANDRY = "husbandry",
    END = "end",
    NETHER = "nether",
    STORY = "story",
}

/**
 * Display configuration for an advancement.
 */
export interface AdvancementDisplay {
    /** Display name (translation key or literal) */
    name: string;
    /** Description text (translation key or literal) */
    description: string;
    /** Icon texture path */
    icon: string;
    /** Type affects visual style */
    type: AdvancementType;
    /** Tab this advancement belongs to */
    tab: AdvancementTab;
    /** Show slideshow animation */
    slideshow?: boolean;
}

/**
 * Rewards granted when advancement is unlocked.
 */
export interface AdvancementRewards {
    /** Experience points to award */
    xp?: number;
    /** Custom reward function */
    custom?: (player: Player) => void;
}

/**
 * Configuration for creating an advancement.
 */
export interface AdvancementConfig {
    /** Unique identifier */
    id: string;
    /** Display configuration */
    display: AdvancementDisplay;
    /** Criteria that must be met */
    criteria?: ICriteria[];
    /** Rewards for completion */
    rewards?: AdvancementRewards;
    /** Parent advancement ID (for tree structure) */
    parent?: string;
}



//#region Main

/**
 * Represents an advancement that can be unlocked by players.
 */
export default class Advancement {
    private static readonly log = Logger.getLogger("Advancement");

    /** Unique identifier */
    readonly id: string;
    /** Display configuration */
    readonly display: AdvancementDisplay;
    /** Criteria that must be met */
    readonly criteria: ICriteria[];
    /** Rewards for completion */
    readonly rewards: AdvancementRewards;
    /** Parent advancement ID */
    readonly parent?: string;



    //#region Constructor

    private constructor(config: AdvancementConfig) {
        this.id = config.id;
        this.display = config.display;
        this.criteria = config.criteria ?? [];
        this.rewards = config.rewards ?? {};
        this.parent = config.parent;
    }



    //#region Factory

    /**
     * Creates and registers a new advancement.
     */
    static create(config: AdvancementConfig): Advancement {
        const existing = Registry.get(config.id);
        if (existing) {
            this.log.warn(`Advancement ${config.id} already exists, returning existing`);
            return existing;
        }

        const advancement = new Advancement(config);
        Registry.register(advancement);
        return advancement;
    }

    /**
     * Creates multiple advancements from an array of configs.
     */
    static createMany(configs: AdvancementConfig[]): Advancement[] {
        return configs.map(config => this.create(config));
    }



    //#region Evaluation

    /**
     * Checks if all criteria are met for a player.
     */
    evaluateCriteria(player: Player): boolean {
        if (this.criteria.length === 0) return false;
        return this.criteria.every(c => c.evaluate(player));
    }

    /**
     * Checks if parent requirements are met.
     */
    checkParent(player: Player): boolean {
        if (!this.parent) return true;
        return Registry.isUnlocked(this.parent, player);
    }

    /**
     * Full evaluation: parent + criteria.
     */
    canUnlock(player: Player): boolean {
        return this.checkParent(player) && this.evaluateCriteria(player);
    }



    //#region Unlocking

    /**
     * Unlocks this advancement for a player.
     * @returns true if newly unlocked, false if already unlocked
     */
    unlock(player: Player): boolean {
        if (Registry.isUnlocked(this.id, player)) {
            return false;
        }

        // Check game mode (creative mode doesn't count)
        if (player.getGameMode() === GameMode.Creative) {
            return false;
        }

        // Store unlock state
        player.setDynamicProperty(`${NAMESPACE}:adv.${this.id}`, true);
        Registry.markUnlocked(this.id, player);

        // Grant rewards
        this.grantRewards(player);

        // Show toast
        Toast.push(player, this);

        Advancement.log.debug(`Unlocked ${this.id} for ${player.name}`);
        return true;
    }

    /**
     * Revokes this advancement from a player.
     */
    revoke(player: Player): boolean {
        if (!Registry.isUnlocked(this.id, player)) {
            return false;
        }

        player.setDynamicProperty(`${NAMESPACE}:adv.${this.id}`, undefined);
        Registry.markLocked(this.id, player);

        Advancement.log.debug(`Revoked ${this.id} from ${player.name}`);
        return true;
    }

    /**
     * Grants rewards to the player.
     */
    private grantRewards(player: Player): void {
        if (this.rewards.xp && this.rewards.xp > 0) {
            player.addExperience(this.rewards.xp);
        }

        if (this.rewards.custom) {
            try {
                this.rewards.custom(player);
            } catch (e) {
                Advancement.log.error(`Custom reward error for ${this.id}: ${e}`);
            }
        }
    }



    //#region Display Helpers

    /**
     * Gets the display name for UI.
     */
    get name(): string {
        return this.display.name;
    }

    /**
     * Gets the icon path for UI.
     */
    get icon(): string {
        return this.display.icon;
    }

    /**
     * Gets the type for visual styling.
     */
    get type(): AdvancementType {
        return this.display.type;
    }

    /**
     * Gets the tab this advancement belongs to.
     */
    get tab(): AdvancementTab {
        return this.display.tab;
    }
}
