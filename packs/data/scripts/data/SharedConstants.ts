/**
 * Shared constants used across multiple advancement definitions.
 */

/** All overworld biomes for the "Adventuring Time" advancement */
export const ALL_OVERWORLD_BIOMES = [
    "bamboo_jungle", "bamboo_jungle_hills", "beach", "birch_forest",
    "birch_forest_hills", "birch_forest_hills_mutated", "birch_forest_mutated",
    "cold_beach", "cold_ocean", "cold_taiga", "cold_taiga_hills", "cold_taiga_mutated",
    "deep_cold_ocean", "deep_frozen_ocean", "deep_lukewarm_ocean", "deep_ocean",
    "deep_warm_ocean", "desert", "desert_hills", "desert_mutated", "extreme_hills",
    "extreme_hills_edge", "extreme_hills_forest", "extreme_hills_mutated",
    "extreme_hills_mutated_forest", "flower_forest", "forest", "forest_hills",
    "frozen_ocean", "frozen_river", "ice_mountains", "ice_plains", "ice_plains_spikes",
    "jungle", "jungle_edge", "jungle_edge_mutated", "jungle_hills", "jungle_mutated",
    "lukewarm_ocean", "mega_spruce_taiga", "mega_spruce_taiga_hills", "mega_taiga",
    "mega_taiga_hills", "mesa", "mesa_bryce", "mesa_plateau", "mesa_plateau_mutated",
    "mesa_plateau_stone", "mesa_plateau_stone_mutated", "mushroom_island",
    "mushroom_island_shore", "ocean", "plains", "river", "roofed_forest",
    "roofed_forest_mutated", "savanna", "savanna_mutated", "savanna_plateau",
    "savanna_plateau_mutated", "stone_beach", "sunflower_plains", "swamp",
    "swamp_mutated", "taiga", "taiga_hills", "taiga_mutated", "warm_ocean", "meadow",
] as const;

/** All nether biomes */
export const ALL_NETHER_BIOMES = [
    "basalt_deltas", "crimson_forest", "nether_wastes", "soulsand_valley", "warped_forest",
] as const;

/** All breedable animals */
export const ALL_BREEDABLE_ANIMALS = [
    "armadillo", "axolotl", "bee", "camel", "cat", "chicken", "cow", "donkey",
    "fox", "frog", "goat", "hoglin", "horse", "llama", "mooshroom", "mule",
    "ocelot", "panda", "pig", "rabbit", "sheep", "sniffer", "strider",
    "trader_llama", "turtle", "wolf",
] as const;

/** All tameable animals */
export const ALL_TAMEABLE_ANIMALS = [
    "cat", "donkey", "horse", "llama", "mule", "parrot", "wolf",
] as const;

/** All cat variants */
export const ALL_CAT_VARIANTS = [
    "tabby", "tuxedo", "red", "siamese", "british_shorthair", "calico",
    "persian", "ragdoll", "white", "jellie", "all_black",
] as const;

/** All hostile mobs for "Monsters Hunted" */
export const ALL_HOSTILE_MOBS = [
    "blaze", "cave_spider", "creeper", "drowned", "elder_guardian", "enderman",
    "endermite", "evoker", "ghast", "guardian", "hoglin", "husk", "magma_cube",
    "phantom", "piglin", "piglin_brute", "pillager", "ravager", "shulker",
    "silverfish", "skeleton", "slime", "spider", "stray", "vex", "vindicator",
    "warden", "witch", "wither_skeleton", "zoglin", "zombie", "zombie_villager",
    "zombified_piglin", "ender_dragon", "wither", "breeze", "bogged",
] as const;

/** All required effects for "How Did We Get Here?" */
export const ALL_EFFECTS = [
    "absorption", "bad_omen", "blindness", "conduit_power", "darkness",
    "dolphins_grace", "fatal_poison", "fire_resistance", "glowing", "haste",
    "health_boost", "hero_of_the_village", "hunger", "instant_damage",
    "instant_health", "invisibility", "jump_boost", "levitation", "mining_fatigue",
    "nausea", "night_vision", "poison", "regeneration", "resistance", "saturation",
    "slow_falling", "slowness", "speed", "strength", "water_breathing", "weakness",
    "wither",
] as const;

/** Potion effects for "A Furious Cocktail" */
export const POTION_EFFECTS = [
    "fire_resistance", "invisibility", "jump_boost", "night_vision", "poison",
    "regeneration", "resistance", "slow_falling", "slowness", "speed", "strength",
    "water_breathing", "weakness",
] as const;
