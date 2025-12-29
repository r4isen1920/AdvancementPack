import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Shiny Gear
 * Get a full set of diamond armor
 */
Advancement.create({
    id: "adv142",
    display: {
        name: "shiny_gear",
        description: "Get a full set of diamond armor",
        icon: "textures/items/diamond_chestplate",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.STORY,
    },
    criteria: [
        Criteria.hasFullArmorSet("diamond"),
    ],
});
