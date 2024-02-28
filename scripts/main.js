import { initializeConstants } from "./constants.js";
import { createScene } from "./scene.js";
import { initializeScene, render } from "./initialize.js";

initializeConstants();
createScene();
initializeScene();
render();
