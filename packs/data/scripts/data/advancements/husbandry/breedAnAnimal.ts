import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";
import { ALL_BREEDABLE_ANIMALS } from "../../SharedConstants";

/**
 * Advancement: Breed an Animal
 * Breed two animals together
 */
Advancement.create({
    id: "adv76",
    display: {
        name: "breed_an_animal",
        description: "Breed two animals together",
        icon: "textures/items/wheat",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.HUSBANDRY,
        slideshow: true,
    },
    criteria: [
        Criteria.hasAnyTracked("breed", ALL_BREEDABLE_ANIMALS),
    ],
});
