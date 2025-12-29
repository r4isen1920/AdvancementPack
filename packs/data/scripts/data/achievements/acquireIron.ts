import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Acquire Iron
 * Smelt an iron ingot
 */
Advancement.create({
    id: "ach6",
    display: {
        name: "acquireIron",
        description: "Smelt an iron ingot",
        icon: "textures/items/iron_ingot",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:iron_ingot"),
    ],
    parent: "ach5",
});
