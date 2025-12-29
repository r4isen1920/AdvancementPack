import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Fly Pig
 * Use a saddle to ride a pig, then have the pig hurt from fall damage
 * This requires event-based detection, handled separately
 */
Advancement.create({
    id: "ach18",
    display: {
        name: "flyPig",
        description: "Use a saddle to ride a pig, then have the pig hurt from fall damage",
        icon: "textures/items/saddle",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
