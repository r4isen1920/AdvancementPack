import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Enchantments
 * Enchant an item at an enchanting table
 * Event-based detection
 */
Advancement.create({
    id: "ach33",
    display: {
        name: "enchantments",
        description: "Enchant an item at an enchanting table",
        icon: "textures/items/book_enchanted",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
