import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Follow Ender Eye
 * Follow an Eye of Ender
 */
Advancement.create({
    id: "adv133",
    display: {
        name: "follow_ender_eye",
        description: "Follow an Eye of Ender",
        icon: "textures/items/ender_eye",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.STORY,
    },
    criteria: [
        Criteria.hasItem("minecraft:ender_eye"),
    ],
});
