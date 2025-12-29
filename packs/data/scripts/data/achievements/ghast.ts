import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Ghast
 * Kill a ghast with a fireball
 * Event-based detection
 */
Advancement.create({
    id: "ach23",
    display: {
        name: "ghast",
        description: "Kill a ghast with a fireball",
        icon: "textures/items/ghast_tear",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
