import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: The End
 * Enter the End
 */
Advancement.create({
    id: "ach27",
    display: {
        name: "theEnd",
        description: "Enter the End",
        icon: "textures/items/ender_eye",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.inDimension("minecraft:the_end"),
    ],
    parent: "ach25",
});
