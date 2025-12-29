import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Kill Cow
 * Kill a cow for leather
 */
Advancement.create({
    id: "ach16",
    display: {
        name: "killCow",
        description: "Kill a cow for leather",
        icon: "textures/items/leather",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasTracked("killed", "cow"),
    ],
    parent: "ach14",
});
