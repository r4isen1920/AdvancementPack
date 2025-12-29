import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Full Beacon
 * Create a full beacon
 * Event-based detection
 */
Advancement.create({
    id: "ach31",
    display: {
        name: "fullBeacon",
        description: "Create a full beacon",
        icon: "textures/blocks/beacon",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
