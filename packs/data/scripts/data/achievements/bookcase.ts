import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Bookcase
 * Build a bookshelf
 */
Advancement.create({
    id: "ach35",
    display: {
        name: "bookcase",
        description: "Build a bookshelf",
        icon: "textures/blocks/bookshelf",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItem("minecraft:bookshelf"),
    ],
    parent: "ach33",
});
