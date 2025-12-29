import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Dragon Egg
 * Obtain the dragon egg
 */
Advancement.create({
    id: "adv98",
    display: {
        name: "dragon_egg",
        description: "Obtain the dragon egg",
        icon: "textures/blocks/dragon_egg",
        type: AdvancementType.GOAL,
        tab: AdvancementTab.END,
    },
    criteria: [
        Criteria.hasItem("minecraft:dragon_egg"),
    ],
});
