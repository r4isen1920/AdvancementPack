import { Player, ItemStack, world, GameMode } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import EventBus from "../engine/EventBus";
import PlayerData from "../engine/PlayerData";
import Toast from "../engine/Toast";



//#region Main

/**
 * Handles player spawn, initialization, and setup.
 */
export default class PlayerHandler {
    private static readonly log = Logger.getLogger("PlayerHandler");



    //#region Initialization

    static init(): void {
        // Handle player spawns
        EventBus.on("playerSpawn", ({ player, initialSpawn }) => {
            if (initialSpawn) {
                this.handleInitialSpawn(player);
            }
        });

        // Handle player leaving for data persistence
        world.beforeEvents.playerLeave.subscribe((event) => {
            PlayerData.save(event.player);
            PlayerData.unload(event.player);
        });

        // Handle game mode changes
        EventBus.on("scriptEvent", ({ id, message, sourceEntity }) => {
            if (id !== "adv:init" || !sourceEntity) return;
            if (sourceEntity.typeId !== "minecraft:player") return;
            
            this.handleResetCommand(sourceEntity as Player, message);
        });

        this.log.info("Player handler initialized");
    }



    //#region Spawn Handling

    private static handleInitialSpawn(player: Player): void {
        this.log.debug(`Initial spawn for ${player.name}`);

        // Load player data
        PlayerData.load(player);

        // Show setup toast
        Toast.push(player, "setup");

        // Clear creative warning flag
        PlayerData.clearMisc(player, "shownCreativeWarning");

        // Give log book if not already given
        const hasLogBook = PlayerData.getMisc<boolean>(player, "hasGivenLogBook");
        if (!hasLogBook) {
            this.giveLogBook(player);
            Toast.push(player, "log_book");
            PlayerData.setMisc(player, "hasGivenLogBook", true);
        }

        // Force survival mode if was in creative
        if (player.getGameMode() === GameMode.Creative) {
            try {
                player.runCommand("gamemode s @s[m=c]");
            } catch {
                // Ignore command errors
            }
        }
    }

    private static giveLogBook(player: Player): void {
        try {
            const inventory = player.getComponent("inventory");
            if (inventory?.container) {
                inventory.container.addItem(new ItemStack("adv:log_book", 1));
            }
        } catch (e) {
            this.log.error(`Failed to give log book to ${player.name}: ${e}`);
        }
    }



    //#region Reset Commands

    private static handleResetCommand(player: Player, command: string): void {
        switch (command) {
            case "all":
                this.resetAll(player);
                break;
            case "biome":
                PlayerData.clearCategory(player, "biome");
                break;
            case "breed":
                PlayerData.clearCategory(player, "breed");
                break;
            case "consumed":
                PlayerData.clearCategory(player, "consumed");
                break;
            case "killed":
                PlayerData.clearCategory(player, "killed");
                break;
            case "tamed":
                PlayerData.clearCategory(player, "tamed");
                this.clearTamedEntities(player);
                break;
        }
    }

    private static resetAll(player: Player): void {
        PlayerData.resetAll(player);
        this.clearTamedEntities(player);
        
        // Clear misc flags
        PlayerData.clearMisc(player, "hasGivenLogBook");
        PlayerData.clearMisc(player, "shownLogBookTip");
        PlayerData.clearMisc(player, "shownCreativeWarning");
        
        this.log.info(`Reset all data for ${player.name}`);
    }

    private static clearTamedEntities(player: Player): void {
        // Remove tamed flags from entities (legacy cleanup)
        try {
            const entities = player.dimension.getEntities({
                tags: ["tamed"],
                location: player.location,
                maxDistance: 128,
            });
            for (const entity of entities) {
                entity.removeTag("tamed");
            }
        } catch {
            // Ignore errors
        }
    }
}

PlayerHandler.init();
