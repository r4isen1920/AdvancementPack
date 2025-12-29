import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Axolotl in a Bucket
 * Catch an axolotl in a bucket
 */
Advancement.create({
    id: "adv73",
    display: {
        name: "axolotl_in_a_bucket",
        description: "Catch an axolotl in a bucket",
        icon: "textures/items/bucket_axolotl",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.HUSBANDRY,
    },
    criteria: [
        Criteria.hasItem("minecraft:axolotl_bucket"),
    ],
});
