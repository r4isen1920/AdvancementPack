import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";
import { ALL_HOSTILE_MOBS } from "../../SharedConstants";

/**
 * Advancement: Kill All Mobs
 * Kill all hostile mobs
 */
Advancement.create({
    id: "adv45",
    display: {
        name: "kill_all_mobs",
        description: "Kill all hostile mobs",
        icon: "textures/items/netherite_sword",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.ADVENTURE,
    },
    criteria: [
        Criteria.hasAllTracked("killed", ALL_HOSTILE_MOBS),
    ],
    rewards: { xp: 100 },
});
