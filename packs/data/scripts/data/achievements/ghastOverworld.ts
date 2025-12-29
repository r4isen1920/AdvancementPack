import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Ghast Overworld
 * Bring a ghast to the overworld
 * Event-based detection
 */
Advancement.create({
    id: "ach24",
    display: {
        name: "ghastOverworld",
        description: "Bring a ghast to the overworld",
        icon: "textures/items/ghast_tear",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
