import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";

/**
 * Advancement: Levitate
 * Levitate up 50 blocks from the attacks of a Shulker
 * Event-based detection (requires distance tracking during levitation)
 */
Advancement.create({
    id: "adv103",
    display: {
        name: "levitate",
        description: "Levitate up 50 blocks from the attacks of a Shulker",
        icon: "textures/items/shulker_shell",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.END,
    },
});
