import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Make Bread
 * Turn wheat into bread
 */
Advancement.create({
    id: "ach8",
    display: {
        name: "makeBread",
        description: "Turn wheat into bread",
        icon: "textures/items/bread",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:bread"),
    ],
    parent: "ach7",
});
