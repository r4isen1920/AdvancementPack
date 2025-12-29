import { GameMode, Player, ItemStack, world, system } from "@minecraft/server";
import { Logger, Vec3 } from "@bedrock-oss/bedrock-boost";
import Registry from "./Registry";
import Toast from "./Toast";
import { AdvancementTab } from "./Advancement";
import EventBus from "./EventBus";
import PlayerData from "./PlayerData";



//#region Types

/** Screen tab configuration */
interface TabConfig {
    tab: AdvancementTab;
    prefix: string;
    rootAdvancement: string;
}

/** Tab configurations */
const TAB_CONFIGS: Record<string, TabConfig> = {
    achievements: {
        tab: AdvancementTab.ACHIEVEMENTS,
        prefix: "_r4ui:legacy_tab:openInventory.1b;",
        rootAdvancement: "openInventory",
    },
    adventure: {
        tab: AdvancementTab.ADVENTURE,
        prefix: "_r4ui:adventure_tab:root.1b;",
        rootAdvancement: "root",
    },
    husbandry: {
        tab: AdvancementTab.HUSBANDRY,
        prefix: "_r4ui:husbandry_tab:root.1b;",
        rootAdvancement: "root",
    },
    end: {
        tab: AdvancementTab.END,
        prefix: "_r4ui:the_end_tab:root.1b;",
        rootAdvancement: "root",
    },
    nether: {
        tab: AdvancementTab.NETHER,
        prefix: "_r4ui:nether_tab:root.1b;",
        rootAdvancement: "root",
    },
    story: {
        tab: AdvancementTab.STORY,
        prefix: "_r4ui:story_tab:root.1b;",
        rootAdvancement: "root",
    },
};



//#region Main

/**
 * Handles the advancement screen UI and dialogue interactions.
 */
export default class Screen {
    private static readonly log = Logger.getLogger("Screen");



    //#region Dialogue Handler

    /**
     * Ensures a dialogue handler entity exists near the player.
     */
    static ensureDialogueHandler(player: Player): void {
        const handlers = player.dimension.getEntities({
            type: "adv:dialogue_handler",
            location: player.location,
            maxDistance: 48,
            closest: 1,
        });

        if (handlers.length === 0) {
            try {
                player.dimension.spawnEntity(
                    "adv:dialogue_handler",
                    Vec3.from(player.location).add(0, 8, 0)
                );
            } catch (e) {
                this.log.error(`Failed to spawn dialogue handler: ${e}`);
            }
        }
    }



    //#region Screen Opening

    /**
     * Opens an advancement screen for a player.
     */
    static open(player: Player, screenName: string): void {
        const config = TAB_CONFIGS[screenName];
        
        if (!config) {
            this.log.warn(`Unknown screen: ${screenName}`);
            this.openEmpty(player);
            return;
        }

        // Ensure dialogue handler exists
        this.ensureDialogueHandler(player);

        // Get unlocked advancements for this tab
        const unlocked = Registry.getUnlockedInTab(player, config.tab);
        
        // Build the parse string
        const parseStrSuffix = ".1b;";
        const parseStrList = unlocked.map(adv => adv.display.name + parseStrSuffix);
        
        const parseStr = config.prefix + 
            parseStrList.join("").replace(/"/g, "");

        // Open dialogue and set title
        try {
            player.runCommand(
                `dialogue open @e[type=adv:dialogue_handler,c=1] @s _r4ui:${screenName}_tab`
            );
            player.onScreenDisplay.setTitle(parseStr);
        } catch (e) {
            this.log.error(`Failed to open screen ${screenName}: ${e}`);
        }
    }

    /**
     * Opens an empty screen.
     */
    private static openEmpty(player: Player): void {
        try {
            player.runCommand(
                `dialogue open @e[type=adv:dialogue_handler,c=1] @s _r4ui:empty_tab`
            );
            player.onScreenDisplay.setTitle("_r4ui:empty:");
        } catch (e) {
            this.log.error(`Failed to open empty screen: ${e}`);
        }
    }



    //#region Item Handling

    /**
     * Handles log book item use.
     */
    static handleLogBookUse(player: Player): void {
        // Check game mode
        if (player.getGameMode() === GameMode.Creative) {
            const hasShownWarning = PlayerData.getMisc<boolean>(player, "shownCreativeWarning");
            if (!hasShownWarning) {
                Toast.push(player, "log_book_survival_only_access");
                PlayerData.setMisc(player, "shownCreativeWarning", true);
            }
            return;
        }

        // Open screen
        player.playSound("random.orb", { volume: 0.5, pitch: 0.75 });
        Screen.open(player, "story");

        // Show first-use tip
        const hasShownTip = PlayerData.getMisc<boolean>(player, "shownLogBookTip");
        if (!hasShownTip) {
            Toast.push(player, "log_book_ui");
            PlayerData.setMisc(player, "shownLogBookTip", true);
        }
    }



    //#region Initialization

    /**
     * Initializes screen event handlers.
     */
    static init(): void {
        // Item use handler
        EventBus.on("itemUse", ({ player, itemStack }) => {
            if (itemStack.typeId === "adv:log_book") {
                Screen.handleLogBookUse(player);
            }
        });

        // Script event handler for opening screens
        EventBus.on("scriptEvent", ({ id, message, sourceEntity }) => {
            if (id !== "adv:open_screen") return;
            if (sourceEntity?.typeId !== "minecraft:player") return;

            const player = sourceEntity as Player;
            const validScreens = ["achievements", "adventure", "husbandry", "end", "nether", "story"];
            
            if (validScreens.includes(message)) {
                Screen.open(player, message);
            } else {
                Screen.openEmpty(player);
            }
        });

        this.log.info("Screen system initialized");
    }
}

Screen.init();
