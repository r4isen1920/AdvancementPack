import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Arbalistic
 * Kill 5 unique mobs with a crossbow
 */
Advancement.create({
    id: "adv37",
    display: {
        name: "arbalistic",
        description: "Kill 5 unique mobs with a crossbow",
        icon: "textures/items/crossbow_standby",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.ADVENTURE,
    },
    criteria: [
        Criteria.hasTrackedCount("crossbow_hit", 5),
    ],
    rewards: { xp: 85 },
});
