import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Build Furnace
 * Make a furnace
 */
Advancement.create({
    id: "ach5",
    display: {
        name: "buildFurnace",
        description: "Make a furnace",
        icon: "textures/blocks/furnace_front_off",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:furnace"),
    ],
    parent: "ach4",
});
