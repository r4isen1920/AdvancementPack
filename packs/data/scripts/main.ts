/**
 *
 * @author
 * r4isen1920
 * https://mcpedl.com/user/r4isen1920
 *
 * @license
 * MIT License
 *
 */

import "./engine/Advancement";
import "./engine/Criteria";
import "./engine/EventBus";
import "./engine/PlayerData";
import "./engine/Registry";
import "./engine/Screen";
import "./engine/Toast";

import "./detectors/BiomeDetector";
import "./detectors/BreedDetector";
import "./detectors/ConsumeDetector";
import "./detectors/CrossbowHitDetector";
import "./detectors/KillDetector";
import "./detectors/RideDetector";
import "./detectors/TameDetector";

import "./handlers/PlayerHandler";
import "./handlers/ProjectileHandler";

import "./data";

import { Logger, LogLevel } from "@bedrock-oss/bedrock-boost";
Logger.setLevel(LogLevel.Debug);
