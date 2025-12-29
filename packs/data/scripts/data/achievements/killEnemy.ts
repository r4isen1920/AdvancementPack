import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Kill Enemy
 * Kill a hostile monster
 */
Advancement.create({
    id: "ach15",
    display: {
        name: "killEnemy",
        description: "Kill a hostile monster",
        icon: "textures/items/bone",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasTrackedCount("killed", 1),
    ],
    parent: "ach14",
});
