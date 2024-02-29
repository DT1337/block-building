import { initializeConstants } from "./constants.js";
import { createScene } from "./scene.js";
import { initializeScene, render } from "./initialize.js";

/**
 * Initializes the application by setting up constants, creating the scene, and rendering it.
 */
function initializeApp() {
	initializeConstants();
	createScene();
	initializeScene();
	render();
}

initializeApp();
