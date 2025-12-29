import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Build Pickaxe
 * Make a wooden pickaxe
 */
Advancement.create({
    id: "ach4",
    display: {
        name: "buildPickaxe",
        description: "Make a wooden pickaxe",
        icon: "textures/items/wood_pickaxe",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:wooden_pickaxe"),
    ],
    parent: "ach3",
});
