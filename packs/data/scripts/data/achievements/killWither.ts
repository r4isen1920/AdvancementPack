import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Kill Wither
 * Defeat the Wither
 */
Advancement.create({
    id: "ach30",
    display: {
        name: "killWither",
        description: "Defeat the Wither",
        icon: "textures/items/nether_star",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasTracked("killed", "wither"),
    ],
    parent: "ach29",
});
