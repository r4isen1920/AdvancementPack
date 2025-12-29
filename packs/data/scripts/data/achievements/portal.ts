import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Portal
 * Build a nether portal
 */
Advancement.create({
    id: "ach22",
    display: {
        name: "portal",
        description: "Build a nether portal",
        icon: "textures/blocks/obsidian",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.inDimension("minecraft:nether"),
    ],
    parent: "ach20",
});
