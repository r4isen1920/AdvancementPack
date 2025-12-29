import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Diamonds to You
 * Throw a diamond at another player
 * Event-based detection
 */
Advancement.create({
    id: "ach21",
    display: {
        name: "diamondsToYou",
        description: "Throw a diamond at another player",
        icon: "textures/items/diamond",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
