import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Build Hoe
 * Make a hoe
 */
Advancement.create({
    id: "ach7",
    display: {
        name: "buildHoe",
        description: "Make a hoe",
        icon: "textures/items/wood_hoe",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.any(
            Criteria.hasItem("minecraft:wooden_hoe"),
            Criteria.hasItem("minecraft:stone_hoe"),
            Criteria.hasItem("minecraft:iron_hoe"),
            Criteria.hasItem("minecraft:golden_hoe"),
            Criteria.hasItem("minecraft:diamond_hoe"),
            Criteria.hasItem("minecraft:netherite_hoe"),
        ),
    ],
    parent: "ach3",
});
