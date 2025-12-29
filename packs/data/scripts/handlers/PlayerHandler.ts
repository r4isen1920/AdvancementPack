import { Player, ItemStack, world, GameMode, system, TicksPerSecond } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import EventBus from "../engine/EventBus";
import PlayerData, { TrackedCategory } from "../engine/PlayerData";
import Toast from "../engine/Toast";
import { NAMESPACE } from "../utils/Namespace";
import { OnWorldLoad } from "@bedrock-oss/stylish";



//#region Main

/**
 * Handles player spawn, initialization, and setup.
 */
export default class PlayerHandler {
    private static readonly playerList: Map<string, Player> = new Map();
    private static readonly log = Logger.getLogger("PlayerHandler");



    //#region Init

    static init(): void {
        // Handle player spawns
        EventBus.on("playerSpawn", ({ player, initialSpawn }) => {
            if (initialSpawn) {
                system.runTimeout(() => {
                    this.handleInitialSpawn(player);
                }, TicksPerSecond);
                this.playerList.set(player.id, player);
            }
        });

        // Handle player leaving for data persistence
        world.beforeEvents.playerLeave.subscribe((event) => {
            PlayerData.save(event.player);
            PlayerData.unload(event.player);
            this.playerList.delete(event.player.id);
        });

        // Handle game mode changes
        EventBus.on("scriptEvent", ({ id, message, sourceEntity }) => {
            if (id !== (NAMESPACE + ":init") || !sourceEntity) return;
            if (sourceEntity.typeId !== "minecraft:player") return;
            

            this.handleResetCommand(sourceEntity as Player, message);
        });

        EventBus.on("worldLoad", () => {
            for (const player of world.getAllPlayers()) {
                if (!this.playerList.has(player.id)) {
                    this.playerList.set(player.id, player);
                    this.handleInitialSpawn(player);
                }
            }
        });

        this.log.info(`Player handler initialized`);
    }

    static getOnlinePlayers(): Player[] {
        const list = Array.from(this.playerList.values());
        if (list.length === 0) {
            for (const player of world.getPlayers()) {
                this.playerList.set(player.id, player);
            }
        }
        return list;
    }



    //#region Spawn

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
    }

    private static giveLogBook(player: Player): void {
        try {
            const inventory = player.getComponent("inventory");
            if (inventory?.container) {
                inventory.container.addItem(new ItemStack(NAMESPACE + ":log_book", 1));
            }
        } catch (e) {
            this.log.error(`Failed to give log book to ${player.name}: ${e}`);
        }
    }



    //#region ResetCmds

    private static handleResetCommand(player: Player, command: string): void {
        switch (command) {
            case "all":
                this.resetAll(player);
                break;
            case "biome":
                PlayerData.clearCategory(player, TrackedCategory.Biome);
                break;
            case "breed":
                PlayerData.clearCategory(player, TrackedCategory.Breed);
                break;
            case "consumed":
                PlayerData.clearCategory(player, TrackedCategory.Consumed);
                break;
            case "killed":
                PlayerData.clearCategory(player, TrackedCategory.Killed);
                break;
            case "tamed":
                PlayerData.clearCategory(player, TrackedCategory.Tamed);
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
