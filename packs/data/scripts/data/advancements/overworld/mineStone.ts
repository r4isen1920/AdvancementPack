import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Mine Stone
 * Mine stone with your new pickaxe
 */
Advancement.create({
    id: "adv140",
    display: {
        name: "mine_stone",
        description: "Mine stone with your new pickaxe",
        icon: "textures/items/wood_pickaxe",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.STORY,
    },
    criteria: [
        Criteria.any(
            Criteria.hasItem("minecraft:blackstone"),
            Criteria.hasItem("minecraft:cobblestone"),
            Criteria.hasItem("minecraft:cobbled_deepslate"),
        ),
    ],
});
