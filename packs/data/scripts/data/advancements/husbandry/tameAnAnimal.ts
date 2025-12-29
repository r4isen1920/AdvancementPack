import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";
import { ALL_TAMEABLE_ANIMALS } from "../../SharedConstants";

/**
 * Advancement: Tame an Animal
 * Tame an animal
 */
Advancement.create({
    id: "adv94",
    display: {
        name: "tame_an_animal",
        description: "Tame an animal",
        icon: "textures/items/bone",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.HUSBANDRY,
    },
    criteria: [
        Criteria.hasAnyTracked("tamed", ALL_TAMEABLE_ANIMALS),
    ],
});
