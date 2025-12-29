import {
    world,
    system,
    Player,
    Entity,
    Block,
    ItemStack,
    WorldAfterEvents,
    EntityDieAfterEvent,
    EntityHurtAfterEvent,
    EntitySpawnAfterEvent,
    PlayerSpawnAfterEvent,
    PlayerBreakBlockAfterEvent,
    PlayerPlaceBlockAfterEvent,
    ItemCompleteUseAfterEvent,
    ItemUseAfterEvent,
    ProjectileHitEntityAfterEvent,
    ProjectileHitBlockAfterEvent,
    EffectAddAfterEvent,
    PlayerInteractWithEntityAfterEvent,
    PlayerInteractWithBlockAfterEvent,
    ScriptEventCommandMessageAfterEvent,
    PlayerDimensionChangeAfterEvent,
} from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";



//#region Types

/** Event types that can be subscribed to */
export type EventType =
    | "playerSpawn"
    | "playerDie"
    | "playerDimensionChange"
    | "entitySpawn"
    | "entityDie"
    | "entityHurt"
    | "playerBreakBlock"
    | "playerPlaceBlock"
    | "itemUse"
    | "itemCompleteUse"
    | "projectileHitEntity"
    | "projectileHitBlock"
    | "effectAdd"
    | "playerInteractWithEntity"
    | "playerInteractWithBlock"
    | "scriptEvent"
    | "tick";

/** Event data passed to handlers */
export interface EventData {
    playerSpawn: { player: Player; initialSpawn: boolean };
    playerDie: { player: Player; cause: string };
    playerDimensionChange: { player: Player; fromDimension: string; toDimension: string };
    entitySpawn: { entity: Entity; cause: string };
    entityDie: { entity: Entity; damager?: Entity; projectile?: Entity };
    entityHurt: { entity: Entity; damage: number; damager?: Entity; projectile?: Entity };
    playerBreakBlock: { player: Player; block: Block; brokenBlockPermutation: any };
    playerPlaceBlock: { player: Player; block: Block };
    itemUse: { player: Player; itemStack: ItemStack };
    itemCompleteUse: { player: Player; itemStack: ItemStack };
    projectileHitEntity: { projectile: Entity; source?: Entity; hitEntity: Entity };
    projectileHitBlock: { projectile: Entity; source?: Entity; hitBlock: Block };
    effectAdd: { entity: Entity; effectType: string; duration: number; amplifier: number };
    playerInteractWithEntity: { player: Player; target: Entity; itemStack?: ItemStack };
    playerInteractWithBlock: { player: Player; block: Block; itemStack?: ItemStack };
    scriptEvent: { id: string; message: string; sourceEntity?: Entity };
    tick: { currentTick: number };
}

/** Handler function type */
type EventHandler<T extends EventType> = (data: EventData[T]) => void;

/** Handler registration with optional filter */
interface HandlerEntry<T extends EventType> {
    handler: EventHandler<T>;
    filter?: (data: EventData[T]) => boolean;
}



//#region Main

/**
 * Centralized event bus that fans out events to multiple handlers.
 * Reduces the number of API subscriptions by consolidating event handling.
 */
export default class EventBus {
    private static readonly log = Logger.getLogger("EventBus");
    
    /** Registered handlers by event type */
    private static readonly handlers: Map<EventType, HandlerEntry<any>[]> = new Map();
    
    /** Tick handlers by interval */
    private static readonly tickHandlers: Map<number, Set<() => void>> = new Map();
    
    /** Active tick runners */
    private static readonly tickRunners: Map<number, number> = new Map();
    
    /** Flag to track if subscriptions are installed */
    private static installed = false;



    //#region API

    /**
     * Subscribes to an event type.
     * @param eventType The event type to subscribe to
     * @param handler The handler function
     * @param filter Optional filter function
     */
    static on<T extends EventType>(
        eventType: T,
        handler: EventHandler<T>,
        filter?: (data: EventData[T]) => boolean
    ): void {
        let list = this.handlers.get(eventType);
        if (!list) {
            list = [];
            this.handlers.set(eventType, list);
        }
        list.push({ handler, filter });
        this.log.debug(`Registered handler for ${eventType}`);
    }

    /**
     * Subscribes to tick events at a specific interval.
     * @param handler The handler function
     * @param interval The interval in ticks (default: 1)
     */
    static onTick(handler: () => void, interval: number = 1): void {
        let set = this.tickHandlers.get(interval);
        if (!set) {
            set = new Set();
            this.tickHandlers.set(interval, set);
        }
        set.add(handler);

        // Start runner if installed
        if (this.installed) {
            this.ensureTickRunner(interval);
        }
    }

    /**
     * Removes a tick handler.
     */
    static offTick(handler: () => void, interval: number = 1): void {
        const set = this.tickHandlers.get(interval);
        if (set) {
            set.delete(handler);
        }
    }

    /**
     * Emits an event to all registered handlers.
     */
    static emit<T extends EventType>(eventType: T, data: EventData[T]): void {
        const list = this.handlers.get(eventType);
        if (!list || list.length === 0) return;

        for (const entry of list) {
            try {
                if (entry.filter && !entry.filter(data)) continue;
                entry.handler(data);
            } catch (e) {
                this.log.error(`Handler error for ${eventType}: ${e}`);
            }
        }
    }



    //#region Installation

    /**
     * Installs all event subscriptions. Call once at startup.
     */
    static install(): void {
        if (this.installed) {
            this.log.warn("EventBus already installed");
            return;
        }

        this.installWorldEvents();
        this.installSystemEvents();
        this.installTickRunners();
        
        this.installed = true;
        this.log.info("EventBus installed");
    }

    private static installWorldEvents(): void {
        // Player spawn
        world.afterEvents.playerSpawn.subscribe((ev: PlayerSpawnAfterEvent) => {
            this.emit("playerSpawn", {
                player: ev.player,
                initialSpawn: ev.initialSpawn,
            });
        });

        // Player dimension change
        world.afterEvents.playerDimensionChange.subscribe((ev: PlayerDimensionChangeAfterEvent) => {
            this.emit("playerDimensionChange", {
                player: ev.player,
                fromDimension: ev.fromDimension.id,
                toDimension: ev.toDimension.id,
            });
        });

        // Entity spawn
        world.afterEvents.entitySpawn.subscribe((ev: EntitySpawnAfterEvent) => {
            this.emit("entitySpawn", {
                entity: ev.entity,
                cause: ev.cause,
            });
        });

        // Entity die
        world.afterEvents.entityDie.subscribe((ev: EntityDieAfterEvent) => {
            this.emit("entityDie", {
                entity: ev.deadEntity,
                damager: ev.damageSource.damagingEntity,
                projectile: ev.damageSource.damagingProjectile,
            });
        });

        // Entity hurt
        world.afterEvents.entityHurt.subscribe((ev: EntityHurtAfterEvent) => {
            this.emit("entityHurt", {
                entity: ev.hurtEntity,
                damage: ev.damage,
                damager: ev.damageSource.damagingEntity,
                projectile: ev.damageSource.damagingProjectile,
            });
        });

        // Player break block
        world.afterEvents.playerBreakBlock.subscribe((ev: PlayerBreakBlockAfterEvent) => {
            this.emit("playerBreakBlock", {
                player: ev.player,
                block: ev.block,
                brokenBlockPermutation: ev.brokenBlockPermutation,
            });
        });

        // Player place block
        world.afterEvents.playerPlaceBlock.subscribe((ev: PlayerPlaceBlockAfterEvent) => {
            this.emit("playerPlaceBlock", {
                player: ev.player,
                block: ev.block,
            });
        });

        // Item use
        world.afterEvents.itemUse.subscribe((ev: ItemUseAfterEvent) => {
            if (ev.source.typeId !== "minecraft:player") return;
            this.emit("itemUse", {
                player: ev.source as Player,
                itemStack: ev.itemStack,
            });
        });

        // Item complete use
        world.afterEvents.itemCompleteUse.subscribe((ev: ItemCompleteUseAfterEvent) => {
            if (ev.source.typeId !== "minecraft:player") return;
            this.emit("itemCompleteUse", {
                player: ev.source as Player,
                itemStack: ev.itemStack,
            });
        });

        // Projectile hit entity
        world.afterEvents.projectileHitEntity.subscribe((ev: ProjectileHitEntityAfterEvent) => {
            const hitInfo = ev.getEntityHit();
            if (!hitInfo.entity) return;
            this.emit("projectileHitEntity", {
                projectile: ev.projectile,
                source: ev.source,
                hitEntity: hitInfo.entity,
            });
        });

        // Projectile hit block
        world.afterEvents.projectileHitBlock.subscribe((ev: ProjectileHitBlockAfterEvent) => {
            const hitInfo = ev.getBlockHit();
            this.emit("projectileHitBlock", {
                projectile: ev.projectile,
                source: ev.source,
                hitBlock: hitInfo.block,
            });
        });

        // Effect add
        world.afterEvents.effectAdd.subscribe((ev: EffectAddAfterEvent) => {
            this.emit("effectAdd", {
                entity: ev.entity,
                effectType: ev.effect.typeId,
                duration: ev.effect.duration,
                amplifier: ev.effect.amplifier,
            });
        });

        // Player interact with entity
        world.afterEvents.playerInteractWithEntity.subscribe((ev: PlayerInteractWithEntityAfterEvent) => {
            this.emit("playerInteractWithEntity", {
                player: ev.player,
                target: ev.target,
                itemStack: ev.itemStack,
            });
        });

        // Player interact with block
        world.afterEvents.playerInteractWithBlock.subscribe((ev: PlayerInteractWithBlockAfterEvent) => {
            this.emit("playerInteractWithBlock", {
                player: ev.player,
                block: ev.block,
                itemStack: ev.itemStack,
            });
        });
    }

    private static installSystemEvents(): void {
        // Script events
        system.afterEvents.scriptEventReceive.subscribe((ev: ScriptEventCommandMessageAfterEvent) => {
            this.emit("scriptEvent", {
                id: ev.id,
                message: ev.message,
                sourceEntity: ev.sourceEntity,
            });
        });
    }

    private static installTickRunners(): void {
        for (const interval of this.tickHandlers.keys()) {
            this.ensureTickRunner(interval);
        }
    }

    private static ensureTickRunner(interval: number): void {
        if (this.tickRunners.has(interval)) return;

        const handle = system.runInterval(() => {
            const set = this.tickHandlers.get(interval);
            if (!set || set.size === 0) return;

            const currentTick = system.currentTick;
            this.emit("tick", { currentTick });

            for (const fn of set) {
                try {
                    fn();
                } catch (e) {
                    this.log.error(`Tick handler error (interval=${interval}): ${e}`);
                }
            }
        }, interval);

        this.tickRunners.set(interval, handle);
        this.log.debug(`Started tick runner for interval=${interval}`);
    }
}

EventBus.install();



//#region Decorators

/**
 * Decorator to subscribe a method to an event type.
 */
export function OnEvent<T extends EventType>(eventType: T, filter?: (data: EventData[T]) => boolean) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        EventBus.on(eventType, (data) => {
            originalMethod.call(target, data);
        }, filter);
    };
}

/**
 * Decorator to subscribe a method to tick events.
 */
export function OnTick(interval: number = 1) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        EventBus.onTick(() => {
            originalMethod.call(target);
        }, interval);
    };
}
