import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Blaze Rod
 * Get a blaze rod
 */
Advancement.create({
    id: "ach25",
    display: {
        name: "blazeRod",
        description: "Get a blaze rod",
        icon: "textures/items/blaze_rod",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:blaze_rod"),
    ],
    parent: "ach22",
});
