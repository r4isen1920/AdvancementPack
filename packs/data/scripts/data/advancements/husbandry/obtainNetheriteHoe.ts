import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Obtain Netherite Hoe
 * Use a smithing table to upgrade a diamond hoe
 */
Advancement.create({
    id: "adv84",
    display: {
        name: "obtain_netherite_hoe",
        description: "Use a smithing table to upgrade a diamond hoe",
        icon: "textures/items/netherite_hoe",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.HUSBANDRY,
    },
    criteria: [
        Criteria.hasItem("minecraft:netherite_hoe"),
    ],
    rewards: { xp: 100 },
});
