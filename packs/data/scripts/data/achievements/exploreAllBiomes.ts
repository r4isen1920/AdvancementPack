import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";
import { ALL_OVERWORLD_BIOMES } from "../SharedConstants";

/**
 * Achievement: Explore All Biomes
 * Discover all biomes
 */
Advancement.create({
    id: "ach32",
    display: {
        name: "exploreAllBiomes",
        description: "Discover all biomes",
        icon: "textures/items/diamond_boots",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasAllTracked("biome", ALL_OVERWORLD_BIOMES),
    ],
    rewards: { xp: 500 },
});
