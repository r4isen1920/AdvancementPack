import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Open Inventory
 * Triggered by function, no criteria needed
 */
Advancement.create({
    id: "ach1",
    display: {
        name: "openInventory",
        description: "Open your inventory",
        icon: "textures/gui/achievements/icon_inventory",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
