import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Tactical Fishing
 * Catch a fish... without a fishing rod
 */
Advancement.create({
    id: "adv92",
    display: {
        name: "tactical_fishing",
        description: "Catch a fish... without a fishing rod",
        icon: "textures/items/bucket_fish",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.HUSBANDRY,
    },
    criteria: [
        Criteria.any(
            Criteria.hasItem("minecraft:cod_bucket"),
            Criteria.hasItem("minecraft:salmon_bucket"),
            Criteria.hasItem("minecraft:tropical_fish_bucket"),
            Criteria.hasItem("minecraft:pufferfish_bucket"),
        ),
    ],
});
