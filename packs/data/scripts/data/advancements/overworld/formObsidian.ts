import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";

/**
 * Advancement: Form Obsidian
 * Obtain a block of obsidian
 * Event-based detection (requires mining obsidian)
 */
Advancement.create({
    id: "adv136",
    display: {
        name: "form_obsidian",
        description: "Obtain a block of obsidian",
        icon: "textures/blocks/obsidian",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.STORY,
    },
});
