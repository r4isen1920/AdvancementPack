import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Bake Cake
 * Use wheat, sugar, milk, and eggs to make a cake
 */
Advancement.create({
    id: "ach9",
    display: {
        name: "bakeCake",
        description: "Use wheat, sugar, milk, and eggs to make a cake",
        icon: "textures/items/cake",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:cake"),
    ],
    parent: "ach8",
});
