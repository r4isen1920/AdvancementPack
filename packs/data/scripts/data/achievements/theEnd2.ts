import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: The End 2
 * Defeat the Ender Dragon
 */
Advancement.create({
    id: "ach28",
    display: {
        name: "theEnd2",
        description: "Defeat the Ender Dragon",
        icon: "textures/items/dragon_breath",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasTracked("killed", "ender_dragon"),
    ],
    parent: "ach27",
});
