import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Tadpole in a Bucket
 * Catch a tadpole in a bucket
 */
Advancement.create({
    id: "adv93",
    display: {
        name: "tadpole_in_a_bucket",
        description: "Catch a tadpole in a bucket",
        icon: "textures/items/bucket_tadpole",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.HUSBANDRY,
    },
    criteria: [
        Criteria.hasItem("minecraft:tadpole_bucket"),
    ],
});
