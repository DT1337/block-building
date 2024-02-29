import {
	scene,
	camera,
	renderer,
	addGridHelper,
	addLights,
	updatePreviewBlock,
	updateCameraPosition,
	animateBalloons,
} from "./scene.js";
import { loadModels, createCustomModels, loadBlockTextures, loadBlockGeometries } from "./assets.js";
import {
	onWindowResize,
	onMouseClick,
	onMouseMove,
	toggleScenicView,
	handleResetButton,
	handleCompass,
	onDocumentKeyDown,
	onDocumentKeyUp,
	selectBlockGeometry,
	selectBlockMaterial,
	isScenicViewActive,
	initializeCompass,
} from "./interaction.js";
import { container, scenicViewToggle, resetButton, compass } from "./constants.js";

/**
 * Initializes the scene, loads models, sets up event listeners, and selects default block geometry and material.
 */
export function initializeScene() {
	addGridHelper();
	addLights();
	loadModels();
	createCustomModels();
	loadBlockGeometries();
	loadBlockTextures();
	initializeCompass();

	selectBlockGeometry("cube");
	selectBlockMaterial("brick");

	updatePreviewBlock();

	window.addEventListener("resize", onWindowResize);
	container.addEventListener("mousemove", onMouseMove);
	container.addEventListener("click", onMouseClick);
	scenicViewToggle.addEventListener("click", toggleScenicView);
	resetButton.addEventListener("click", handleResetButton);
	document.addEventListener("keydown", onDocumentKeyDown);
	document.addEventListener("keyup", onDocumentKeyUp);
	compass.addEventListener("click", handleCompass);

	const geometrySlots = document.querySelectorAll(".geometrySlot");
	geometrySlots.forEach((geometrySlot) => {
		geometrySlot.addEventListener("click", () => {
			geometrySlots.forEach((geometrySlot) => {
				geometrySlot.classList.remove("selected");
			});
			geometrySlot.classList.add("selected");

			const itemId = geometrySlot.id;
			selectBlockGeometry(itemId);
		});
	});

	const materialSlots = document.querySelectorAll(".materialSlot");
	materialSlots.forEach((materialSlot) => {
		materialSlot.addEventListener("click", () => {
			materialSlots.forEach((materialSlot) => {
				materialSlot.classList.remove("selected");
			});
			materialSlot.classList.add("selected");

			const itemId = materialSlot.id;
			selectBlockMaterial(itemId);
		});
	});
}

/**
 * Initiates the render loop.
 */
export function render() {
	if (isScenicViewActive) {
		animateBalloons();
		requestAnimationFrame(render);
	}

	updateCameraPosition();
	renderer.render(scene, camera);
}
