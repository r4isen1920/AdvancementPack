import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";

/**
 * Advancement: Find End City
 * Go into the city
 * Event-based detection (requires biome or structure detection)
 */
Advancement.create({
    id: "adv101",
    display: {
        name: "find_end_city",
        description: "Go into the city",
        icon: "textures/items/end_crystal",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.END,
    },
});
