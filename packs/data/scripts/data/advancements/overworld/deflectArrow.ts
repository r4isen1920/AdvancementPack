import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";

/**
 * Advancement: Deflect Arrow
 * Deflect a projectile with a shield
 * Event-based detection
 */
Advancement.create({
    id: "adv131",
    display: {
        name: "deflect_arrow",
        description: "Deflect a projectile with a shield",
        icon: "textures/items/wood_shield",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.STORY,
    },
});
