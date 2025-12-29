import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Build Better Pickaxe
 * Make a stone pickaxe
 */
Advancement.create({
    id: "ach10",
    display: {
        name: "buildBetterPickaxe",
        description: "Make a stone pickaxe",
        icon: "textures/items/stone_pickaxe",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:stone_pickaxe"),
    ],
    parent: "ach4",
});
