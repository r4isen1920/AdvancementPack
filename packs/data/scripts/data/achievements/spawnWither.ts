import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Spawn Wither
 * Summon the Wither
 * Event-based detection
 */
Advancement.create({
    id: "ach29",
    display: {
        name: "spawnWither",
        description: "Summon the Wither",
        icon: "textures/items/nether_star",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
