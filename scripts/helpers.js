import * as THREE from "three";
import { camera, scene } from "./scene.js";
import { container, debugContainer, elements, cellSize, minGridValue, maxGridValue } from "./constants";

// Function to get intersected objects
export function getIntersectedObjects(event) {
	const mouse = new THREE.Vector2();
	mouse.x = (event.clientX / container.offsetWidth) * 2 - 1;
	mouse.y = -(event.clientY / container.offsetHeight) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	return raycaster.intersectObjects(elements);
}

// Function to snap a point to the nearest grid position
export function snapPointToGrid(point) {
	const snappedPoint = point.clone();
	snappedPoint.x = Math.min(
		maxGridValue,
		Math.max(minGridValue, Math.floor(snappedPoint.x / cellSize) * cellSize + cellSize / 2)
	);
	snappedPoint.y = Math.max(cellSize / 2, Math.floor(snappedPoint.y / cellSize) * cellSize + cellSize / 2);
	snappedPoint.z = Math.min(
		maxGridValue,
		Math.max(minGridValue, Math.floor(snappedPoint.z / cellSize) * cellSize + cellSize / 2)
	);
	return snappedPoint;
}

// Function to adjust a point to avoid collisions with existing objects
export function adjustPointForCollisions(point) {
	const raycaster = new THREE.Raycaster(point.clone().add(new THREE.Vector3(0, -cellSize / 2, 0)), new THREE.Vector3(0, -1, 0));
	const intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length > 0) {
		const lowestY = Math.floor(intersects[0].point.y / cellSize) * cellSize;
		point.y = Math.max(cellSize / 2, lowestY + cellSize / 2);
	}
	return point;
}

// Function to update debug information
export function updateInfo(point) {
	debugContainer.innerText = `(X:${point.x.toFixed(2)}, Y:${point.y.toFixed(2)}, Z:${point.z.toFixed(2)})`;
}
