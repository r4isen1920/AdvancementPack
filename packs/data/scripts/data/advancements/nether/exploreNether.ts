import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";
import { ALL_NETHER_BIOMES } from "../../SharedConstants";

/**
 * Advancement: Explore Nether
 * Explore all nether biomes
 */
Advancement.create({
    id: "adv126",
    display: {
        name: "explore_nether",
        description: "Explore all nether biomes",
        icon: "textures/items/netherite_boots",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.NETHER,
    },
    criteria: [
        Criteria.hasAllTracked("biome", ALL_NETHER_BIOMES),
    ],
    rewards: { xp: 500 },
});
