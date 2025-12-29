import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";
import { ALL_EFFECTS } from "../../SharedConstants";

/**
 * Advancement: All Effects
 * Have all effects applied at the same time
 */
Advancement.create({
    id: "adv108",
    display: {
        name: "all_effects",
        description: "Have all effects applied at the same time",
        icon: "textures/items/bucket_milk",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.NETHER,
    },
    criteria: [
        Criteria.hasAllEffects(ALL_EFFECTS),
    ],
    rewards: { xp: 1000 },
});
