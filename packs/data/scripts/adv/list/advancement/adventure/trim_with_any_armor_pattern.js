import { world } from "@minecraft/server";

import { showAchievementToast } from "../../../toast";
import { searchItemId } from "../../../detectItems";

world.afterEvents.itemUseOn.subscribe((e) => {
	let { block, source } = e;

	if (
		block.getItemStack()?.typeId != "minecraft:smithing_table" ||
		source.hasTag("adv65")
	)
		return;

	var hasItem = searchItemId(source, "armor_trim_smithing_template");
	if (!hasItem) return;

	showAchievementToast(
		source,
		"065",
		"task",
		"textures/items/dune_armor_trim_smithing_template",
		"adv65",
	);
});
