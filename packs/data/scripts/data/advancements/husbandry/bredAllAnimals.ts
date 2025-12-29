import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";
import { ALL_BREEDABLE_ANIMALS } from "../../SharedConstants";

/**
 * Advancement: Bred All Animals
 * Breed all the animals
 */
Advancement.create({
    id: "adv75",
    display: {
        name: "bred_all_animals",
        description: "Breed all the animals",
        icon: "textures/items/golden_carrot",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.HUSBANDRY,
    },
    criteria: [
        Criteria.hasAllTracked("breed", ALL_BREEDABLE_ANIMALS),
    ],
    rewards: { xp: 100 },
    parent: "adv76",
});
