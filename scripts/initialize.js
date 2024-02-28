import {
	scene,
	camera,
	renderer,
	addGridHelper,
	addLights,
	updatePreviewBlock,
	updateCameraPosition,
	animateBalloon,
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

// Function to initialize the application
export function initializeScene() {
	addGridHelper();
	addLights();
	loadModels();
	createCustomModels();
	loadBlockGeometries();
	loadBlockTextures();
	initializeCompass();

	// Select default block geometry and material
	selectBlockGeometry("cube");
	selectBlockMaterial("brick");

	updatePreviewBlock();

	// Event listeners
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

// Function to start the render loop
export function render() {
	if (isScenicViewActive) {
		animateBalloon();
		requestAnimationFrame(render);
	}

	updateCameraPosition();
	renderer.render(scene, camera);
}
