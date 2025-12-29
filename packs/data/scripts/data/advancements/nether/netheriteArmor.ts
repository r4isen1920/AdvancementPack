import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Netherite Armor
 * Get a full suit of netherite armor
 */
Advancement.create({
    id: "adv120",
    display: {
        name: "netherite_armor",
        description: "Get a full suit of netherite armor",
        icon: "textures/items/netherite_chestplate",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.NETHER,
    },
    criteria: [
        Criteria.hasFullArmorSet("netherite"),
    ],
    rewards: { xp: 100 },
});
