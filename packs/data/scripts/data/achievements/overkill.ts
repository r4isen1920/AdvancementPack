import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Overkill
 * Deal 8 hearts of damage in one hit
 * Event-based detection
 */
Advancement.create({
    id: "ach34",
    display: {
        name: "overkill",
        description: "Deal 8 hearts of damage in one hit",
        icon: "textures/items/diamond_sword",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
