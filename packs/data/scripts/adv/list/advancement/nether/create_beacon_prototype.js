import { world } from "@minecraft/server";

import { showAchievementToast } from "../../../toast";
import { Vector3 } from "../../../utilsVec3";
import { detectBlocks } from "../../../detectBlocks";

world.afterEvents.playerPlaceBlock.subscribe((e) => {
	let { block, dimension } = e;

	if (block.getItemStack()?.typeId != "minecraft:beacon") return;

	const pyramidBlocksVolume = detectBlocks(
		Vector3.subtract(block.location, new Vector3(1, 1, 1)),
		Vector3.add(block.location, new Vector3(1, 1, 1)),
		block.dimension,
	);
	if (pyramidBlocksVolume.length < 9) return;

	let pyramidBlocksUsed = 0;
	pyramidBlocksVolume.forEach((block) => {
		if (
			block.getItemStack()?.typeId != "minecraft:iron_block" &&
			block.getItemStack()?.typeId != "minecraft:gold_block" &&
			block.getItemStack()?.typeId != "minecraft:emerald_block" &&
			block.getItemStack()?.typeId != "minecraft:diamond_block" &&
			block.getItemStack()?.typeId != "minecraft:netherite_block"
		)
			return;

		pyramidBlocksUsed += 1;
	});
	if (pyramidBlocksUsed < 9) return;

	const players = dimension.getPlayers({
		location: block.location,
		maxDistance: 20,
		tags: ["adv0"],
		exludeTags: ["adv109"],
	});
	players.forEach((player) => {
		showAchievementToast(player, "109", "task", "9043968", "adv109");
	});
});
