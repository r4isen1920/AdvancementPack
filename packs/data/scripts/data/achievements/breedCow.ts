import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Breed Cow
 * Breed two cows with wheat
 */
Advancement.create({
    id: "ach17",
    display: {
        name: "breedCow",
        description: "Breed two cows with wheat",
        icon: "textures/items/wheat",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasTracked("breed", "cow"),
    ],
    parent: "ach16",
});
