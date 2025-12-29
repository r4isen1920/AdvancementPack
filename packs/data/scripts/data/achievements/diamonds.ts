import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Diamonds
 * Find diamonds
 */
Advancement.create({
    id: "ach20",
    display: {
        name: "diamonds",
        description: "Find diamonds",
        icon: "textures/items/diamond",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:diamond"),
    ],
    parent: "ach6",
});
