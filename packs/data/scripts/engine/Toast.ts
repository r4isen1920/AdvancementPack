import { Player, RawMessage, system, world } from "@minecraft/server";
import Advancement, { AdvancementType } from "./Advancement";
import { Logger } from "@bedrock-oss/bedrock-boost";
import EventBus from "./EventBus";
import PlayerHandler from "../handlers/PlayerHandler";



//#region Types

/** Toast display status */
enum ToastStatus {
    WAITING,
    DISPLAYING,
    DONE,
}

/** Toast queue entry */
interface ToastEntry {
    data: Advancement | string;
    status: ToastStatus;
    elapsedTicks: number;
}

/** Type mapping for toast headers */
const TOAST_TYPE_MAP: Record<AdvancementType, [string, string]> = {
    [AdvancementType.ENTRY]: ["00", "chat.advancementpack"],
    [AdvancementType.ACHIEVEMENT]: ["01", "chat.achievement.earn"],
    [AdvancementType.ADVANCEMENT]: ["02", "chat.advancement.task"],
    [AdvancementType.CHALLENGE]: ["03", "chat.advancement.challenge"],
    [AdvancementType.GOAL]: ["04", "chat.advancement.goal"],
};



//#region Main

/**
 * Handles displaying toast notifications to players.
 * Manages a queue system for concurrent toasts with proper timing.
 */
export default class Toast {
    private static readonly log = Logger.getLogger("Toast");
    
    /** Duration to display each toast (in ticks) */
    private static readonly DISPLAY_DURATION = 130;
    
    /** Maximum concurrent toasts */
    private static readonly MAX_CONCURRENT = 5;
    
    /** Toast queues per player */
    private static readonly queues: Map<string, ToastEntry[]> = new Map();



    //#region API

    /**
     * Queues an advancement toast for a player.
     */
    static push(player: Player, advancement: Advancement): void;
    /**
     * Queues a game tip toast for a player.
     */
    static push(player: Player, tipId: string): void;
    static push(player: Player, data: Advancement | string): void {
        if (!player.isValid) return;

        let queue = this.queues.get(player.id);
        if (!queue) {
            queue = [];
            this.queues.set(player.id, queue);
        }

        queue.push({
            data,
            status: ToastStatus.WAITING,
            elapsedTicks: 0,
        });

        const id = typeof data === "string" ? data : data.id;
        this.log.debug(`Queued toast "${id}" for ${player.name}`);
    }

    /**
     * Clears all queued toasts for a player.
     */
    static clear(player: Player): void {
        this.queues.delete(player.id);
    }



    //#region Display

    /**
     * Shows a toast immediately (used internally).
     */
    private static show(player: Player, data: Advancement | string): void {
        if (!player.isValid) return;

        const message = this.buildMessage(data);
        player.sendMessage(message);
        player.playSound("ui.toast.in");

        // Play challenge sound if applicable
        if (data instanceof Advancement && data.type === AdvancementType.CHALLENGE) {
            player.playSound("ui.toast.challenge_complete");
        }

        // Send chat announcement for advancements
        if (data instanceof Advancement) {
            this.announceInChat(player, data);
        }
    }

    /**
     * Builds the message for the toast UI.
     */
    private static buildMessage(data: Advancement | string): RawMessage {
        if (typeof data === "string") {
            // Game tip
            return { rawtext: [
                { text: "_r4ui:toast_1.tip." },
                { text: data },
            ]};
        }

        // Advancement toast
        const typeInfo = TOAST_TYPE_MAP[data.type];
        const slideshow = data.display.slideshow ? "1" : "0";

        const ref = data.id.slice(3).padStart(3, "0");
        
        return { rawtext: [
            { text: "_r4ui:toast_0.header." },
            { text: typeInfo[0] },
            { text: ".body." },
            { text: ref },
            { text: `.slideshow_${slideshow}.` },
            { text: data.display.icon },
        ]};
    }

    /**
     * Announces advancement completion in chat.
     */
    private static announceInChat(player: Player, advancement: Advancement): void {
        const typeInfo = TOAST_TYPE_MAP[advancement.type];
        
        const ref = advancement.id.slice(3).padStart(3, "0");

        const message: RawMessage = {
            rawtext: [
                {
                    translate: typeInfo[1],
                    with: {
                        rawtext: [
                            { text: player.name },
                            { translate: `r4ui.toast.body.${ref}` },
                        ]
                    }
                }
            ]
        };

        // Send to all players
        world.sendMessage(message);
    }



    //#region Tick Processing

    /**
     * Processes toast queue for a player.
     */
    private static processPlayer(player: Player): void {
        const queue = this.queues.get(player.id);
        if (!queue || queue.length === 0) return;

        // Process up to MAX_CONCURRENT toasts
        const batch = queue.slice(0, this.MAX_CONCURRENT);
        let anyCompleted = false;

        for (const entry of batch) {
            switch (entry.status) {
                case ToastStatus.WAITING:
                    this.show(player, entry.data);
                    entry.status = ToastStatus.DISPLAYING;
                    break;

                case ToastStatus.DISPLAYING:
                    if (entry.elapsedTicks >= this.DISPLAY_DURATION) {
                        entry.status = ToastStatus.DONE;
                        anyCompleted = true;
                    }
                    break;
            }
            entry.elapsedTicks++;
        }

        // Remove completed toasts
        if (anyCompleted) {
            player.playSound("ui.toast.out");
            const remaining = queue.filter(e => e.status !== ToastStatus.DONE);
            
            if (remaining.length === 0) {
                this.queues.delete(player.id);
            } else {
                this.queues.set(player.id, remaining);
            }
        }
    }



    //#region Initialization

    /**
     * Initializes the toast system tick handler.
     */
    static init(): void {
        EventBus.onTick(() => {
            for (const player of PlayerHandler.getOnlinePlayers()) {
                this.processPlayer(player);
            }
        }, 1);

        this.log.info("Toast system initialized");
    }
}
