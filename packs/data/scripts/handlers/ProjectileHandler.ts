import { Player, world } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import EventBus from "../engine/EventBus";



//#region Main

/**
 * Handles projectile hit feedback (pling sound).
 */
export default class ProjectileHandler {
    private static readonly log = Logger.getLogger("ProjectileHandler");

    static init(): void {
        EventBus.on("projectileHitEntity", ({ projectile, source, hitEntity }) => {
            if (!source || source.typeId !== "minecraft:player") return;
            if (projectile.typeId !== "minecraft:arrow") return;
            
            // Don't play sound for hitting inanimate objects
            if (hitEntity.matches?.({ families: ["inanimate"] })) return;

            // Play pling sound
            (source as Player).playSound("random.orb", { pitch: 0.5, volume: 0.25 });
        });

        this.log.info("Projectile handler initialized");
    }
}

ProjectileHandler.init();
