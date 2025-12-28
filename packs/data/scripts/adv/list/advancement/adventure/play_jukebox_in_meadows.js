import { world } from "@minecraft/server";

import { showAchievementToast } from "../../../toast";

world.afterEvents.itemUseOn.subscribe((e) => {
	let { itemStack, block, source } = e;

	if (
		block.getItemStack()?.typeId != "minecraft:jukebox" ||
		source.hasTag("adv49") ||
		!itemStack?.typeId.startsWith("minecraft:music_disc")
	)
		return;
	if (source.getDynamicProperty("adv:currentBiome") != "meadow") return;

	showAchievementToast(source, "049", "task", "5505024", "adv49");
});
