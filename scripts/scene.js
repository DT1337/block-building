import * as THREE from "three";
import { container, elements, gridDimensions, cellSize } from "./constants";
import { currentBlockGeometry, isScenicViewActive, cameraPosition } from "./interaction";
import { render } from "./initialize";

// Scene, camera, renderer, and other scene-related variables
export let scene, camera, renderer;
export let collisionHelper;
export let previewBlock;

/**
 * Creates the 3D scene.
 */
export function createScene() {
	// Create the scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x0ea5e9);

	// Create the camera
	const aspectRatio = container.offsetWidth / container.offsetHeight;
	camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 1000);
	camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
	camera.lookAt(0, 0, 0);

	// Create the renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	container.appendChild(renderer.domElement);
}

/**
 * Adds the grid helper to the scene.
 */
export function addGridHelper() {
	const gridHelper = new THREE.GridHelper(cellSize * gridDimensions, gridDimensions);
	scene.add(gridHelper);

	// Add collision helper for physics
	const collisionHelperGeometry = new THREE.PlaneGeometry(128, 128);
	collisionHelperGeometry.rotateX(-Math.PI / 2);
	collisionHelper = new THREE.Mesh(collisionHelperGeometry, new THREE.MeshBasicMaterial({ visible: false }));
	scene.add(collisionHelper);
	elements.push(collisionHelper);

	// Add surface for visual representation
	const surfaceGeometry = new THREE.PlaneGeometry(10000, 10000);
	surfaceGeometry.rotateX(-Math.PI / 2);
	const surfaceMaterial = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 });
	const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
	scene.add(surface);
}

/**
 * Adds lights to the scene.
 */
export function addLights() {
	// Ambient light
	const ambientLight = new THREE.AmbientLight(0x323232, 16.0);
	scene.add(ambientLight);

	// Directional light
	const directionalLight = new THREE.DirectionalLight(0xffff66, 1);
	directionalLight.position.copy(new THREE.Vector3(0, 30, 0));
	scene.add(directionalLight);
}

/**
 * Creates the preview block for placing new objects.
 */
function createPreviewBlock() {
	const previewBlockGeometry = currentBlockGeometry;
	const previewBlockMaterial = new THREE.MeshBasicMaterial({
		color: 0x646464,
		opacity: 0.5,
		transparent: true,
	});
	previewBlock = new THREE.Mesh(previewBlockGeometry, previewBlockMaterial);
}

/**
 * Updates the preview block's position in the scene.
 */
export function updatePreviewBlock() {
	if (previewBlock) {
		const previewPosition = new THREE.Vector3().copy(previewBlock.position);
		scene.remove(previewBlock);
		createPreviewBlock();
		previewBlock.position.set(previewPosition);
	} else {
		createPreviewBlock();
	}
	scene.add(previewBlock);
	render();
}

/**
 * Updates the camera position based on whether scenic view is active.
 */
export function updateCameraPosition() {
	if (isScenicViewActive) {
		const radius = 300;
		const angle = Date.now() * 0.0005;
		const x = Math.cos(angle) * radius;
		const z = Math.sin(angle) * radius;
		camera.position.set(x, 150, z);
		camera.lookAt(0, 0, 0);

		requestAnimationFrame(updateCameraPosition);
	} else {
		camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
		camera.lookAt(0, 0, 0);
	}
}

/**
 * Animates the balloons in the scene.
 */

let animDuration = 10000;
let animStartTime = Date.now();
let morphTargets = [new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1.5, 1), new THREE.Vector3(1, 1, 1)];

export function animateBalloons() {
	let balloons = [];
	scene.traverse(function (child) {
		if (child.userData && child.userData.id === "balloon") {
			balloons.push(child);
		}
	});

	let currentTime = Date.now();
	let elapsedTime = (currentTime - animStartTime) % animDuration;
	let normalizedTime = elapsedTime / animDuration;

	// Rise balloons
	let yPosition = Math.sin(normalizedTime * Math.PI * 2) * 0.5;
	balloons.forEach((balloon) => (balloon.position.y = yPosition));

	// Morph balloons
	let morphIndex = Math.floor(normalizedTime * (morphTargets.length - 1));
	let nextMorphIndex = (morphIndex + 1) % morphTargets.length;
	let morphValue = normalizedTime * (morphTargets.length - 1) - morphIndex;

	let morphTarget = new THREE.Vector3();
	morphTarget.lerpVectors(morphTargets[morphIndex], morphTargets[nextMorphIndex], morphValue);
	balloons.forEach((balloon) => balloon.scale.copy(morphTarget));
}
