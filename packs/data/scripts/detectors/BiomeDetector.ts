import { Player, Entity, world } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import PlayerData from "../engine/PlayerData";
import EventBus from "../engine/EventBus";

/**
 * Biome ID mapping from entity property values.
 */
const BIOME_MAP: Record<number, string> = {
    1: "bamboo_jungle",
    2: "bamboo_jungle_hills",
    3: "beach",
    4: "birch_forest",
    5: "birch_forest_hills",
    6: "birch_forest_hills_mutated",
    7: "birch_forest_mutated",
    8: "cold_beach",
    9: "cold_ocean",
    10: "cold_taiga",
    11: "cold_taiga_hills",
    12: "cold_taiga_mutated",
    13: "deep_cold_ocean",
    14: "deep_frozen_ocean",
    15: "deep_lukewarm_ocean",
    16: "deep_ocean",
    17: "deep_warm_ocean",
    18: "desert",
    19: "desert_hills",
    20: "desert_mutated",
    21: "extreme_hills",
    22: "extreme_hills_edge",
    23: "extreme_hills_forest",
    24: "extreme_hills_mutated",
    25: "extreme_hills_mutated_forest",
    26: "flower_forest",
    27: "forest",
    28: "forest_hills",
    29: "frozen_ocean",
    30: "frozen_river",
    31: "ice_mountains",
    32: "ice_plains",
    33: "ice_plains_spikes",
    34: "jungle",
    35: "jungle_edge",
    36: "jungle_edge_mutated",
    37: "jungle_hills",
    38: "jungle_mutated",
    39: "lukewarm_ocean",
    40: "mega_spruce_taiga",
    41: "mega_spruce_taiga_hills",
    42: "mega_taiga",
    43: "mega_taiga_hills",
    44: "mesa",
    45: "mesa_bryce",
    46: "mesa_plateau",
    47: "mesa_plateau_mutated",
    48: "mesa_plateau_stone",
    49: "mesa_plateau_stone_mutated",
    50: "mushroom_island",
    51: "mushroom_island_shore",
    52: "ocean",
    53: "plains",
    54: "river",
    55: "roofed_forest",
    56: "roofed_forest_mutated",
    57: "savanna",
    58: "savanna_mutated",
    59: "savanna_plateau",
    60: "savanna_plateau_mutated",
    61: "stone_beach",
    62: "sunflower_plains",
    63: "swamp",
    64: "swamp_mutated",
    65: "taiga",
    66: "taiga_hills",
    67: "taiga_mutated",
    68: "warm_ocean",
    69: "basalt_deltas",
    70: "crimson_forest",
    71: "nether_wastes",
    72: "soulsand_valley",
    73: "warped_forest",
    74: "meadow",
    75: "grove",
    76: "snowy_slopes",
    77: "jagged_peaks",
    78: "frozen_peaks",
    79: "stony_peaks",
    80: "cherry_grove",
    81: "deep_dark",
    82: "mangrove_swamp",
    83: "dripstone_caves",
    84: "lush_caves",
};

/**
 * Handles biome detection and tracking for players.
 */
export class BiomeDetector {
    private static readonly log = Logger.getLogger("BiomeDetector");
    private static readonly DETECTION_INTERVAL = 75;

    static init(): void {
        // Spawn biome detector entities periodically
        EventBus.onTick(() => {
            for (const player of world.getAllPlayers()) {
                this.spawnDetector(player);
            }
        }, this.DETECTION_INTERVAL);

        // Handle biome detector script events
        EventBus.on("scriptEvent", ({ id, sourceEntity }) => {
            if (!sourceEntity || sourceEntity.typeId !== "adv:detect_biome") return;
            
            this.handleDetectorResult(sourceEntity);
        });

        this.log.info("Biome detector initialized");
    }

    private static spawnDetector(player: Player): void {
        try {
            player.dimension.spawnEntity("adv:detect_biome", player.location);
        } catch {
            // Silently ignore spawn failures
        }
    }

    private static handleDetectorResult(entity: Entity): void {
        const biomeValue = entity.getProperty("adv:biome_check") as number;
        if (!biomeValue || biomeValue <= 0) return;

        const biomeName = BIOME_MAP[biomeValue];
        if (!biomeName) {
            entity.remove();
            return;
        }

        // Find nearest player
        const players = entity.dimension.getPlayers({
            location: entity.location,
            maxDistance: 2,
            closest: 1,
        });

        for (const player of players) {
            // Track the biome
            PlayerData.track(player, "biome", biomeName);
            PlayerData.setMisc(player, "currentBiome", biomeName);
        }

        entity.remove();
    }
}

BiomeDetector.init();
