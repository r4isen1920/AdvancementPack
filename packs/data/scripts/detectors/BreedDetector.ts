import { Entity, EntityInitializationCause } from "@minecraft/server";
import { Logger } from "@bedrock-oss/bedrock-boost";
import PlayerData, { TrackedCategory } from "../engine/PlayerData";
import EventBus from "../engine/EventBus";

/**
 * Handles breeding event detection.
 */
export class BreedDetector {
    private static readonly log = Logger.getLogger("BreedDetector");

    static init(): void {
        EventBus.on("entitySpawn", ({ entity, cause }) => {
            if (cause !== EntityInitializationCause.Born) return;
            
            this.handleBirth(entity);
        });

        this.log.info("Breed detector initialized");
    }

    private static handleBirth(entity: Entity): void {
        const entityType = entity.typeId.replace("minecraft:", "");
        
        // Find nearest players to credit
        const players = entity.dimension.getPlayers({
            location: entity.location,
            maxDistance: 16,
            closest: 1,
        });

        for (const player of players) {
            PlayerData.track(player, TrackedCategory.Breed, entityType);
        }
    }
}

BreedDetector.init();
