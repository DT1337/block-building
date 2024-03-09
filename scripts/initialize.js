import {
	container,
	geometrySlots,
	materialSlots,
	gravitationButton,
	examplesButton,
	examplesCloseButton,
	examplesModal,
	scenicViewToggle,
	resetButton,
	compass,
} from "./constants.js";
import {
	scene,
	camera,
	renderer,
	addGridHelper,
	addLights,
	updatePreviewBlock,
	updateCameraPosition,
	animateBalloons,
	animateShip,
} from "./scene.js";
import { loadModels, createCustomModels, loadBlockTextures, loadBlockGeometries } from "./assets.js";
import {
	onWindowResize,
	onMouseClick,
	onMouseMove,
	toggleGravitation,
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
	window.onclick = function (event) {
		if (event.target == examplesModal) {
			examplesModal.style.display = "none";
		}
	};

	document.addEventListener("keydown", onDocumentKeyDown);
	document.addEventListener("keyup", onDocumentKeyUp);
	container.addEventListener("mousemove", onMouseMove);
	container.addEventListener("click", onMouseClick);

	gravitationButton.onclick = toggleGravitation;
	examplesButton.onclick = () => {
		examplesModal.style.display = "flex";
	};
	examplesCloseButton.onclick = () => {
		examplesModal.style.display = "none";
	};

	scenicViewToggle.onclick = toggleScenicView;
	resetButton.onclick = handleResetButton;

	compass.onclick = () => handleCompass(event.target.id);

	geometrySlots.forEach((geometrySlot) => {
		geometrySlot.onclick = () => {
			geometrySlots.forEach((geometrySlot) => {
				geometrySlot.classList.remove("selected");
			});
			geometrySlot.classList.add("selected");

			const itemId = geometrySlot.id;
			selectBlockGeometry(itemId);
		};
	});

	materialSlots.forEach((materialSlot) => {
		materialSlot.onclick = () => {
			materialSlots.forEach((materialSlot) => {
				materialSlot.classList.remove("selected");
			});
			materialSlot.classList.add("selected");

			const itemId = materialSlot.id;
			selectBlockMaterial(itemId);
		};
	});
}

/**
 * Initiates the render loop.
 */
export function render() {
	if (isScenicViewActive) {
		animateBalloons();
		animateShip();
		requestAnimationFrame(render);
	}

	updateCameraPosition();
	renderer.render(scene, camera);
}
