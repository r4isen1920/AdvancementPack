import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Kill Dragon
 * Good luck
 */
Advancement.create({
    id: "adv102",
    display: {
        name: "kill_dragon",
        description: "Good luck",
        icon: "textures/advancement/icons/dragon_head",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.END,
    },
    criteria: [
        Criteria.hasTracked("killed", "ender_dragon"),
    ],
});
