import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Elytra
 * Find elytra
 */
Advancement.create({
    id: "adv99",
    display: {
        name: "elytra",
        description: "Find elytra",
        icon: "textures/items/elytra",
        type: AdvancementType.GOAL,
        tab: AdvancementTab.END,
    },
    criteria: [
        Criteria.hasItem("minecraft:elytra"),
    ],
});
