import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";
import Criteria from "../../engine/Criteria";

/**
 * Achievement: Mine Wood
 * Attack a tree until a block of wood pops out
 */
Advancement.create({
    id: "ach2",
    display: {
        name: "mineWood",
        description: "Attack a tree until a block of wood pops out",
        icon: "textures/blocks/log_oak",
        type: AdvancementType.ACHIEVEMENT,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
    criteria: [
        Criteria.hasItemMatching(/minecraft:.*_log/),
    ],
    parent: "ach1",
});
