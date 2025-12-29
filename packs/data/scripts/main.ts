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



//* --- DEPENDENCIES --- *//

import { Logger, LogLevel } from "@bedrock-oss/bedrock-boost";
Logger.setLevel(LogLevel.Debug);

//* ------ ENGINE ------ *//

import EventBus from "./engine/EventBus";
EventBus.install();

import Registry from "./engine/Registry";
Registry.init();

import Screen from "./engine/Screen";
Screen.init();

import Toast from "./engine/Toast";
Toast.init();


//* ---- DETECTORS ----- *//

import "./detectors/BiomeDetector";
import "./detectors/BreedDetector";
import "./detectors/ConsumeDetector";
import "./detectors/CrossbowHitDetector";
import "./detectors/KillDetector";
import "./detectors/RideDetector";
import "./detectors/TameDetector";


//* ----- HANDLERS ----- *//

import "./handlers/PlayerHandler";
import "./handlers/ProjectileHandler";


//* ------- DATA ------- *//

import "./data";
