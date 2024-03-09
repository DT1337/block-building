import * as THREE from "three";
import { getIntersectedObjects, updateInfo, snapPointToGrid, adjustPointForCollisions } from "./helpers.js";
import { initializeScene, render } from "./initialize.js";
import { camera, renderer, scene, collisionHelper, updatePreviewBlock, previewBlock } from "./scene.js";
import {
	container,
	elements,
	scenicViewToggle,
	compassNorthButton,
	compassEastButton,
	compassSouthButton,
	compassWestButton,
	gravitationButton,
} from "./constants.js";
import { blockGeometries, blockMaterials } from "./assets.js";

// Variables to store current block geometry, material, and scene state
export let currentBlockGeometry;
export let currentBlockMaterial;
export let isScenicViewActive = false;
export let cameraPosition = new THREE.Vector3(150, 90, 0);
let isGravitationActive = true;
let isTopDownView = false;
let isDeleting = false;
let isPlacingBlock = false;

/**
 * Handles mouse movement events.
 * @param {MouseEvent} event - The mouse event object.
 */
export function onMouseMove(event) {
	if (isScenicViewActive) {
		return;
	}

	const intersectedObjects = getIntersectedObjects(event);

	if (intersectedObjects.length > 0) {
		const intersection = intersectedObjects[0];
		const intersectionPoint = intersection.point.clone().add(intersection.face.normal);
		const snappedPoint = snapPointToGrid(intersectionPoint);

		updateInfo(intersection.point);
		previewBlock.position.set(snappedPoint.x, snappedPoint.y, snappedPoint.z);
	}

	render();
}

/**
 * Handles mouse click events.
 * @param {MouseEvent} event - The mouse event object.
 */
export function onMouseClick(event) {
	if (isScenicViewActive || isPlacingBlock) {
		return;
	}

	const intersectedObjects = getIntersectedObjects(event);

	if (intersectedObjects.length > 0) {
		if (isDeleting) {
			const intersectedObject = intersectedObjects[0];
			if (intersectedObject.object !== collisionHelper) {
				scene.remove(intersectedObject.object);
				elements.splice(elements.indexOf(intersectedObject.object), 1);
			}
		} else {
			const intersection = intersectedObjects[0];
			const intersectionPoint = intersection.point.clone().add(intersection.face.normal);
			const snappedPoint = snapPointToGrid(intersectionPoint);
			const adjustedPoint = adjustPointForCollisions(snappedPoint.clone());

			const block = new THREE.Mesh(currentBlockGeometry, currentBlockMaterial);
			block.position.copy(snappedPoint);

			// Animate block falling if necessary
			if (isGravitationActive && adjustedPoint.y !== snappedPoint.y) {
				animateBlockFalling(block, adjustedPoint);
			} else {
				scene.add(block);
				elements.push(block);
				render();
			}
		}

		render();
	}
}

/**
 * Animates the falling of a block to avoid collisions.
 * @param {THREE.Mesh} block - The block mesh.
 * @param {THREE.Vector3} finalPosition - The final position of the block.
 */
function animateBlockFalling(block, finalPosition) {
	const initialPosition = block.position.clone();
	const initialScale = block.scale.clone();
	const stretchedScale = new THREE.Vector3(1, 2, 1);
	const duration = 500;
	const stretchDuration = 200;

	scene.add(block);
	elements.push(block);
	render();

	const startTime = performance.now();

	function updatePositionAndScale() {
		const elapsed = performance.now() - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const stretchProgress = Math.min(elapsed / stretchDuration, 1);

		const newPosition = initialPosition.clone().lerp(finalPosition, progress);
		block.position.copy(newPosition);

		if (progress < 1) {
			const newScale = initialScale.clone().lerp(stretchedScale, stretchProgress);
			block.scale.copy(newScale);
		} else {
			const newScale = stretchedScale.clone().lerp(initialScale, stretchProgress);
			block.scale.copy(newScale);
		}

		render();

		if (progress < 1) {
			requestAnimationFrame(updatePositionAndScale);
		} else {
			isPlacingBlock = false;
		}
	}

	updatePositionAndScale();
	isPlacingBlock = true;
}

/**
 * Handles window resize events.
 */
export function onWindowResize() {
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	render();
}

/**
 * Selects the block geometry.
 * @param {string} selectGeometry - The selected geometry type.
 */
export function selectBlockGeometry(selectGeometry) {
	currentBlockGeometry = blockGeometries[selectGeometry];
	updatePreviewBlock();
	render();
}

/**
 * Selects the block material.
 * @param {string} selectMaterial - The selected material type.
 */
export function selectBlockMaterial(selectMaterial) {
	currentBlockMaterial = blockMaterials[selectMaterial];
	render();
}

/**
 * Toggles gravitation.
 */
export function toggleGravitation() {
	gravitationButton.classList.toggle("selected");
	isGravitationActive = !isGravitationActive;
	render();
}

/**
 * Toggles scenic view mode.
 */
export function toggleScenicView() {
	scenicViewToggle.classList.toggle("selected");
	isScenicViewActive = !isScenicViewActive;
	render();
}

/**
 * Handles the reset button click.
 */
export function handleResetButton() {
	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}
	scene.traverse(function (obj) {
		if (obj instanceof THREE.Mesh) {
			obj.geometry.dispose();
			obj.material.dispose();
		}
	});
	initializeScene();
	handleCompass();
}

/**
 * Initializes the compass buttons.
 */
export function initializeCompass() {
	positionButtons("north");
}

/**
 * Handles compass button clicks.
 * @param {string} direction - The compass direction that was clicked.
 */
export function handleCompass(direction = "north") {
	let y = isTopDownView ? 200 : 90;

	switch (direction) {
		case "east":
			cameraPosition = new THREE.Vector3(0, y, 150);
			break;
		case "south":
			cameraPosition = new THREE.Vector3(-150, y, 0);
			break;
		case "west":
			cameraPosition = new THREE.Vector3(0, y, -150);
			break;
		case "topDown":
			isTopDownView = !isTopDownView;
			cameraPosition.y = isTopDownView ? 200 : 90;
			break;
		case "north":
		default:
			cameraPosition = new THREE.Vector3(150, y, 0);
			break;
	}

	positionButtons(direction);
	render();
}

/**
 * Positions the compass buttons based on the current direction.
 * @param {string} direction - The current compass direction.
 */
function positionButtons(direction) {
	let north = "top: 20px; left: 50%;";
	let east = "top: 50%; right: 20px;";
	let south = "bottom: 100px; left: 50%;";
	let west = "top: 50%; left: 20px;";

	switch (direction) {
		case "north":
			compassNorthButton.setAttribute("style", north);
			compassEastButton.setAttribute("style", east);
			compassSouthButton.setAttribute("style", south);
			compassWestButton.setAttribute("style", west);
			break;
		case "east":
			compassNorthButton.setAttribute("style", west);
			compassEastButton.setAttribute("style", north);
			compassSouthButton.setAttribute("style", east);
			compassWestButton.setAttribute("style", south);
			break;
		case "south":
			compassNorthButton.setAttribute("style", south);
			compassEastButton.setAttribute("style", west);
			compassSouthButton.setAttribute("style", north);
			compassWestButton.setAttribute("style", east);
			break;
		case "west":
			compassNorthButton.setAttribute("style", east);
			compassEastButton.setAttribute("style", south);
			compassSouthButton.setAttribute("style", west);
			compassWestButton.setAttribute("style", north);
			break;
		default:
			break;
	}
}

/**
 * Handles document key down events.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
export function onDocumentKeyDown(event) {
	if (event.key == " ") {
		isDeleting = true;
	}
}

/**
 * Handles document key up events.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
export function onDocumentKeyUp(event) {
	if (event.key == " ") {
		isDeleting = false;
	}
}
