import Advancement, { AdvancementType, AdvancementTab } from "../../engine/Advancement";

/**
 * Achievement: Snipe Skeleton
 * Kill a skeleton with an arrow from more than 50 meters
 * Event-based detection
 */
Advancement.create({
    id: "ach19",
    display: {
        name: "snipeSkeleton",
        description: "Kill a skeleton with an arrow from more than 50 meters",
        icon: "textures/items/bow_standby",
        type: AdvancementType.CHALLENGE,
        tab: AdvancementTab.ACHIEVEMENTS,
    },
});
