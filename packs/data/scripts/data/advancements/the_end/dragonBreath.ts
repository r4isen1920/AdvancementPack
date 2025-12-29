import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Dragon Breath
 * Collect dragon's breath in a glass bottle
 */
Advancement.create({
    id: "adv97",
    display: {
        name: "dragon_breath",
        description: "Collect dragon's breath in a glass bottle",
        icon: "textures/items/dragons_breath",
        type: AdvancementType.GOAL,
        tab: AdvancementTab.END,
    },
    criteria: [
        Criteria.hasItem("minecraft:dragon_breath"),
    ],
});
