import { Player, Entity } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import PlayerData, { TrackedCategory } from "../engine/PlayerData";
import EventBus from "../engine/EventBus";

/**
 * List of mobs that count for kill tracking.
 */
const KILLABLE_MOBS = new Set([
    "blaze", "cave_spider", "creeper", "drowned", "elder_guardian",
    "enderman", "endermite", "evoker", "ghast", "guardian", "hoglin",
    "husk", "magma_cube", "phantom", "piglin", "piglin_brute",
    "pillager", "ravager", "shulker", "silverfish", "skeleton",
    "slime", "spider", "stray", "vex", "vindicator", "warden",
    "witch", "wither_skeleton", "zoglin", "zombie", "zombie_villager",
    "zombified_piglin", "breeze", "bogged",
]);

/**
 * Handles entity kill detection.
 */
export class KillDetector {
    private static readonly log = Logger.getLogger("KillDetector");

    static init(): void {
        // Regular mob kills
        EventBus.on("entityDie", ({ entity, damager }) => {
            if (!damager || damager.typeId !== "minecraft:player") return;
            
            this.handleKill(damager as Player, entity);
        });

        // Boss kills (need special handling due to death mechanics)
        EventBus.on("entityHurt", ({ entity, damage, damager }) => {
            if (!damager || damager.typeId !== "minecraft:player") return;
            
            const entityType = entity.typeId;
            if (entityType !== "minecraft:ender_dragon" && entityType !== "minecraft:wither") {
                return;
            }

            this.handleBossHurt(damager as Player, entity, damage);
        });

        this.log.info("Kill detector initialized");
    }

    private static handleKill(player: Player, entity: Entity): void {
        const entityType = entity.typeId;
        if (!entityType.startsWith("minecraft:")) return;

        const mobName = entityType.replace("minecraft:", "");
        
        // Check if it's a trackable mob
        const isMonster = entity.matches?.({ families: ["monster"] });
        const isCow = entity.matches?.({ families: ["cow"] });
        
        if (!isMonster && !isCow && !KILLABLE_MOBS.has(mobName)) return;

        PlayerData.track(player, TrackedCategory.Killed, mobName);
    }

    private static handleBossHurt(player: Player, entity: Entity, damage: number): void {
        const health = entity.getComponent("health");
        if (!health) return;

        const currentHealth = health.currentValue;
        const healthPercent = (currentHealth / health.effectiveMax) * 100;

        // If damage would kill or health is very low
        if (healthPercent < 3 || damage >= currentHealth) {
            const mobName = entity.typeId.replace("minecraft:", "");
            PlayerData.track(player, TrackedCategory.Killed, mobName);
            
            try {
                entity.kill();
            } catch {
                // Entity might already be dying
            }
        }
    }
}

KillDetector.init();
