import { Player } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import PlayerData from "../engine/PlayerData";
import EventBus from "../engine/EventBus";

/**
 * Handles item consumption tracking.
 */
export class ConsumeDetector {
    private static readonly log = Logger.getLogger("ConsumeDetector");

    static init(): void {
        EventBus.on("itemCompleteUse", ({ player, itemStack }) => {
            this.handleConsume(player, itemStack.typeId);
        });

        this.log.info("Consume detector initialized");
    }

    private static handleConsume(player: Player, itemTypeId: string): void {
        if (!itemTypeId.startsWith("minecraft:")) return;

        const itemName = itemTypeId.replace("minecraft:", "");
        PlayerData.track(player, "consumed", itemName);
    }
}

ConsumeDetector.init();
