import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Potion
 * Brew a potion
 */
Advancement.create({
    id: "ach26",
    display: {
        name: "potion",
        description: "Brew a potion",
        icon: "textures/items/potion_bottle_drinkable",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItemMatching(/minecraft:potion/),
    ],
    parent: "ach25",
});
