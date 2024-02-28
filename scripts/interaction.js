import * as THREE from "three";
import { getIntersectedObjects, updateInfo, snapPointToGrid, adjustPointForCollisions } from "./helpers.js";
import { initializeScene, render } from "./initialize.js";
import { camera, renderer, scene, collisionHelper, updatePreviewBlock, previewBlock } from "./scene.js";
import { container, elements, compassNorthButton, compassEastButton, compassSouthButton, compassWestButton } from "./constants.js";
import { blockGeometries, blockTextures } from "./assets.js";

export let currentBlockGeometry;
export let currentBlockMaterial;
export let isScenicViewActive = false;
export let cameraPosition = new THREE.Vector3(150, 90, 0);
let isTopDownView = false;
let isDeleting = false;

// Function to handle mouse movement event
export function onMouseMove(event) {
	if (isScenicViewActive) {
		render();
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

// Function to handle mouse click event
export function onMouseClick(event) {
	if (isScenicViewActive) {
		render();
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

			// If the blocks y position is adjusted due to gravitation, animate its falling
			if (adjustedPoint.y !== snappedPoint.y) {
				animateBlockFalling(block, adjustedPoint);
			} else {
				// Otherwise directly add the block to the scene
				scene.add(block);
				elements.push(block);
				render();
			}
		}

		render();
	}
}

// Function to animate the falling of a block
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
		}
	}

	updatePositionAndScale();
}
// Function to handle window resize event
export function onWindowResize() {
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	render();
}

// Function to handle block geometry select
export function selectBlockGeometry(selectGeometry) {
	currentBlockGeometry = blockGeometries[selectGeometry];
	updatePreviewBlock();
}

// Function to handle block material select
export function selectBlockMaterial(selectMaterial) {
	currentBlockMaterial = new THREE.MeshBasicMaterial({ map: blockTextures[selectMaterial] });
}

// Function to toggle scenic view
export function toggleScenicView() {
	isScenicViewActive = !isScenicViewActive;
}

// Function to handle reset button
export function handleResetButton() {
	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}
	// Optionally, dispose of resources associated with the objects in the scene
	scene.traverse(function (obj) {
		if (obj instanceof THREE.Mesh) {
			obj.geometry.dispose();
			obj.material.dispose();
		}
	});
	initializeScene();
}

// Function to initialize the compass
export function initializeCompass() {
	positionButtons("north");
}

// Function to handle the compass
export function handleCompass(event) {
	let y = isTopDownView ? 200 : 90;

	switch (event.target.id) {
		case "north":
			cameraPosition = new THREE.Vector3(150, y, 0);
			positionButtons("north");
			break;
		case "east":
			cameraPosition = new THREE.Vector3(0, y, 150);
			positionButtons("east");
			break;
		case "south":
			cameraPosition = new THREE.Vector3(-150, y, 0);
			positionButtons("south");
			break;
		case "west":
			cameraPosition = new THREE.Vector3(0, y, -150);
			positionButtons("west");
			break;
		case "topDown":
			isTopDownView = !isTopDownView;
			cameraPosition.y = isTopDownView ? 200 : 90;
			break;
		default:
			break;
	}
}

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

// Function to handle document key down event
export function onDocumentKeyDown(event) {
	if (event.keyCode == 32) {
		isDeleting = true;
	}
}

// Function to handle document key up event
export function onDocumentKeyUp(event) {
	if (event.keyCode == 32) {
		isDeleting = false;
	}
}
