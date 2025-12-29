import { Player, Entity } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import PlayerData from "../engine/PlayerData";
import EventBus from "../engine/EventBus";

/**
 * Handles crossbow hit tracking for the "Arbalist" advancement.
 */
export class CrossbowHitDetector {
    private static readonly log = Logger.getLogger("CrossbowHitDetector");

    static init(): void {
        EventBus.on("entityDie", ({ entity, damager, projectile }) => {
            if (!damager || damager.typeId !== "minecraft:player") return;
            if (!projectile || projectile.typeId !== "minecraft:arrow") return;

            this.handleCrossbowKill(damager as Player, entity);
        });

        this.log.info("Crossbow hit detector initialized");
    }

    private static handleCrossbowKill(player: Player, entity: Entity): void {
        // Check if player is holding a crossbow
        const inventory = player.getComponent("inventory");
        if (!inventory?.container) return;

        const heldItem = inventory.container.getItem(player.selectedSlotIndex);
        if (heldItem?.typeId !== "minecraft:crossbow") return;

        const entityType = entity.typeId.replace("minecraft:", "");
        PlayerData.track(player, "crossbow_hit", entityType);
    }
}

CrossbowHitDetector.init();
