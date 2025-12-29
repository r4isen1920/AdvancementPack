import { Player, world } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import PlayerData, { TrackedCategory } from "../engine/PlayerData";
import EventBus from "../engine/EventBus";
import PlayerHandler from "../handlers/PlayerHandler";

/**
 * Handles biome detection and tracking for players.
 */
export class BiomeDetector {
    private static readonly log = Logger.getLogger("BiomeDetector");
    private static readonly DETECTION_INTERVAL = 20;

    static init(): void {
        EventBus.onTick(() => {
            for (const player of PlayerHandler.getOnlinePlayers()) {
                this.setBiome(player);
            }
        }, this.DETECTION_INTERVAL);

        this.log.info("Biome detector initialized");
    }

    private static setBiome(player: Player): void {
        const biomeName = player.dimension.getBiome(player.location).id;

        PlayerData.track(player, TrackedCategory.Biome, biomeName);
        PlayerData.setMisc(player, "currentBiome", biomeName);
    }
}

BiomeDetector.init();
