import Advancement, { AdvancementType, AdvancementTab } from "../../../engine/Advancement";
import Criteria from "../../../engine/Criteria";

/**
 * Advancement: Ride Strider
 * Ride a strider
 */
Advancement.create({
    id: "adv124",
    display: {
        name: "ride_strider",
        description: "Ride a strider",
        icon: "textures/items/warped_fungus_on_a_stick",
        type: AdvancementType.ADVANCEMENT,
        tab: AdvancementTab.NETHER,
    },
    criteria: [
        Criteria.isRiding("minecraft:strider"),
    ],
});
