import { Player, Entity } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import PlayerData from "../engine/PlayerData";
import EventBus from "../engine/EventBus";

/**
 * Taming requirements per entity type.
 */
const TAME_ITEMS: Record<string, string[] | "ride"> = {
    "minecraft:cat": ["minecraft:cod", "minecraft:salmon"],
    "minecraft:donkey": "ride",
    "minecraft:horse": "ride",
    "minecraft:llama": "ride",
    "minecraft:mule": "ride",
    "minecraft:parrot": [
        "minecraft:beetroot_seeds",
        "minecraft:melon_seeds",
        "minecraft:pumpkin_seeds",
        "minecraft:wheat_seeds",
        "minecraft:torchflower_seeds",
        "minecraft:pitcher_pod",
    ],
    "minecraft:wolf": ["minecraft:bone"],
};

/**
 * Handles entity taming detection.
 */
export class TameDetector {
    private static readonly log = Logger.getLogger("TameDetector");

    static init(): void {
        EventBus.on("playerInteractWithEntity", ({ player, target, itemStack }) => {
            this.handleInteraction(player, target, itemStack?.typeId);
        });

        this.log.info("Tame detector initialized");
    }

    private static handleInteraction(player: Player, target: Entity, itemTypeId?: string): void {
        const tameReq = TAME_ITEMS[target.typeId];
        if (!tameReq) return;

        // Check if entity is tamed
        const isTamed = target.getComponent("is_tamed");
        if (!isTamed) return;

        // Check if we already tracked this specific entity
        const tamedKey = `tamed_${target.id}`;
        if (PlayerData.getMisc<boolean>(player, tamedKey)) return;

        // Validate taming item if not ride-based
        if (tameReq !== "ride") {
            if (!itemTypeId || !tameReq.includes(itemTypeId)) return;
        }

        const entityType = target.typeId.replace("minecraft:", "");
        PlayerData.track(player, "tamed", entityType);
        PlayerData.setMisc(player, tamedKey, true);
    }
}

TameDetector.init();
