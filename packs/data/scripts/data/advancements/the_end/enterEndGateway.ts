import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";

/**
 * Advancement: Enter End Gateway
 * Escape the island
 * Event-based detection
 */
Advancement.create({
    id: "adv100",
    display: {
        name: "enter_end_gateway",
        description: "Escape the island",
        icon: "textures/blocks/end_stone",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.END,
    },
});
