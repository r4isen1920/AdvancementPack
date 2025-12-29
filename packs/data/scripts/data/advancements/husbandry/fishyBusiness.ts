import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Fishy Business
 * Catch a fish
 */
Advancement.create({
    id: "adv79",
    display: {
        name: "fishy_business",
        description: "Catch a fish",
        icon: "textures/items/fishing_rod",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.HUSBANDRY,
    },
    criteria: [
        Criteria.any(
            Criteria.hasItem("minecraft:cod"),
            Criteria.hasItem("minecraft:salmon"),
            Criteria.hasItem("minecraft:tropical_fish"),
            Criteria.hasItem("minecraft:pufferfish"),
        ),
    ],
});
