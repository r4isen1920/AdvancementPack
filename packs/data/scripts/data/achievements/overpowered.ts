import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Overpowered
 * Eat an enchanted golden apple
 */
Advancement.create({
    id: "ach11",
    display: {
        name: "overpowered",
        description: "Eat an enchanted golden apple",
        icon: "textures/items/apple_golden",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasTracked("consumed", "enchanted_golden_apple"),
    ],
    parent: "ach6",
});
