import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";
import { POTION_EFFECTS } from "../../SharedConstants";

/**
 * Advancement: All Potions
 * Have all potion effects applied at the same time
 */
Advancement.create({
    id: "adv107",
    display: {
        name: "all_potions",
        description: "Have all potion effects applied at the same time",
        icon: "textures/items/bucket_milk",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.NETHER,
    },
    criteria: [
        Criteria.hasAllEffects(POTION_EFFECTS),
    ],
    rewards: { xp: 100 },
});
