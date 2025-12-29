import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";

/**
 * Advancement: Respawn Dragon
 * Summon the dragon again
 * Event-based detection
 */
Advancement.create({
    id: "adv104",
    display: {
        name: "respawn_dragon",
        description: "Summon the dragon again",
        icon: "textures/items/end_crystal",
        type: AdvancementType.GOAL,
        tab: AdvancementTab.END,
    },
});
