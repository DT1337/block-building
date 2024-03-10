import * as THREE from "three";
import { camera, scene } from "./scene.js";
import { container, coordinates, elements, cellSize, minGridValue, maxGridValue } from "./constants";

/**
 * Retrieves the objects intersected by the mouse ray.
 * @param {MouseEvent} event - The mouse event object.
 * @returns {Array<THREE.Intersection>} - Array of intersected objects.
 */
export function getIntersectedObjects(event) {
	const mouse = new THREE.Vector2();
	const raycaster = new THREE.Raycaster();

	mouse.x = (event.clientX / container.offsetWidth) * 2 - 1;
	mouse.y = -(event.clientY / container.offsetHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

	return raycaster.intersectObjects(elements);
}

/**
 * Snaps a point to the grid.
 * @param {THREE.Vector3} point - The point to snap.
 * @returns {THREE.Vector3} - The snapped point.
 */
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

/**
 * Adjusts a point to avoid collisions.
 * @param {THREE.Vector3} point - The point to adjust.
 * @returns {THREE.Vector3} - The adjusted point.
 */
export function adjustPointForCollisions(point) {
	const raycaster = new THREE.Raycaster(point.clone().add(new THREE.Vector3(0, -cellSize / 2, 0)), new THREE.Vector3(0, -1, 0));
	const intersects = raycaster.intersectObjects(scene.children);

	if (intersects.length > 0) {
		const lowestY = Math.floor(intersects[0].point.y / cellSize) * cellSize;
		point.y = Math.max(cellSize / 2, lowestY + cellSize / 2);
	}

	return point;
}

/**
 * Updates the information display.
 * @param {THREE.Vector3} intersectionPoint - The point of intersection.
 */
export function updateInfo(point) {
	coordinates.innerText = `(X:${point.x.toFixed(2)}, Y:${point.y.toFixed(2)}, Z:${point.z.toFixed(2)})`;
}
