import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";

/**
 * Advancement: Totem of Undying
 * Use a Totem of Undying to cheat death
 * Event-based detection
 */
Advancement.create({
    id: "adv61",
    display: {
        name: "totem_of_undying",
        description: "Use a Totem of Undying to cheat death",
        icon: "textures/items/totem",
        type: AdvancementType.GOAL,
        tab: AdvancementTab.ADVENTURE,
    },
});
