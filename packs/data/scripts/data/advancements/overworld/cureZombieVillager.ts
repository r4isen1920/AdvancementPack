import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";

/**
 * Advancement: Cure Zombie Villager
 * Weaken and then cure a Zombie Villager
 * Event-based detection
 */
Advancement.create({
    id: "adv130",
    display: {
        name: "cure_zombie_villager",
        description: "Weaken and then cure a Zombie Villager",
        icon: "textures/items/apple_golden",
        type: AdvancementType.GOAL,
        tab: AdvancementTab.STORY,
    },
});
