import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Cook Fish
 * Cook a fish
 */
Advancement.create({
    id: "ach12",
    display: {
        name: "cookFish",
        description: "Cook a fish",
        icon: "textures/items/fish_cooked",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.any(
            Criteria.hasItem("minecraft:cooked_cod"),
            Criteria.hasItem("minecraft:cooked_salmon"),
        ),
    ],
    parent: "ach5",
});
