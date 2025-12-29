import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Build Sword
 * Make a wooden sword
 */
Advancement.create({
    id: "ach14",
    display: {
        name: "buildSword",
        description: "Make a wooden sword",
        icon: "textures/items/wood_sword",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:wooden_sword"),
    ],
    parent: "ach3",
});
