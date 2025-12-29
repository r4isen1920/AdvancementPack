import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Iron Tools
 * Make an iron pickaxe
 */
Advancement.create({
    id: "adv137",
    display: {
        name: "iron_tools",
        description: "Make an iron pickaxe",
        icon: "textures/items/iron_pickaxe",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.STORY,
    },
    criteria: [
        Criteria.hasItem("minecraft:iron_pickaxe"),
    ],
});
