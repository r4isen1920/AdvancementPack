import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Lava Bucket
 * Fill a bucket with lava
 */
Advancement.create({
    id: "adv135",
    display: {
        name: "lava_bucket",
        description: "Fill a bucket with lava",
        icon: "textures/items/bucket_lava",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.STORY,
    },
    criteria: [
        Criteria.hasItem("minecraft:lava_bucket"),
    ],
});
