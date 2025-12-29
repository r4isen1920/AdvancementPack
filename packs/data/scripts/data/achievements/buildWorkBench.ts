import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Build Work Bench
 * Make a crafting table
 */
Advancement.create({
    id: "ach3",
    display: {
        name: "buildWorkBench",
        description: "Make a crafting table",
        icon: "textures/blocks/crafting_table_front",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:crafting_table"),
    ],
    parent: "ach2",
});
