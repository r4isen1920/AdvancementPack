import { Player, world } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import PlayerData, { TrackedCategory } from "../engine/PlayerData";
import EventBus from "../engine/EventBus";
import PlayerHandler from "../handlers/PlayerHandler";

/**
 * Handles riding state tracking.
 */
export class RideDetector {
    private static readonly log = Logger.getLogger("RideDetector");
    private static readonly CHECK_INTERVAL = 5;

    static init(): void {
        EventBus.onTick(() => {
            for (const player of PlayerHandler.getOnlinePlayers()) {
                this.checkRiding(player);
            }
        }, this.CHECK_INTERVAL);

        this.log.info("Ride detector initialized");
    }

    private static checkRiding(player: Player): void {
        const riding = player.getComponent("riding");
        
        if (!riding?.entityRidingOn) {
            // Clear current riding state
            PlayerData.clearMisc(player, "currentlyRiding");
            return;
        }

        const ridingEntity = riding.entityRidingOn;
        const entityType = ridingEntity.typeId.replace("minecraft:", "");
        
        PlayerData.track(player, TrackedCategory.Riding, entityType);
        PlayerData.setMisc(player, "currentlyRiding", entityType);
    }
}

RideDetector.init();
