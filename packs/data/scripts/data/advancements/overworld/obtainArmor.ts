import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Obtain Armor
 * Protect yourself with a piece of iron armor
 */
Advancement.create({
    id: "adv141",
    display: {
        name: "obtain_armor",
        description: "Protect yourself with a piece of iron armor",
        icon: "textures/items/iron_chestplate",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.STORY,
    },
    criteria: [
        Criteria.any(
            Criteria.hasItem("minecraft:iron_helmet"),
            Criteria.hasItem("minecraft:iron_chestplate"),
            Criteria.hasItem("minecraft:iron_leggings"),
            Criteria.hasItem("minecraft:iron_boots"),
        ),
    ],
});
