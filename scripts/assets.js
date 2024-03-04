import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; // Adjust the import path as needed
import { cellSize } from "./constants.js";
import { scene } from "./scene.js";
import { render } from "./initialize.js";

// Dictionary to store block geometries and textures
export const blockGeometries = {};
export const blockMaterials = {};

/**
 * Loads 3D models into the scene.
 */
export function loadModels() {
	const models = [
		{
			url: "/block-building/models/fellglow_tower_-_voxel_art.glb",
			id: "tower",
			position: new THREE.Vector3(-200, -5, 80),
			scale: 5,
		},
		{
			url: "/block-building/models/tropical_voxel_island.glb",
			id: "tropical_island",
			position: new THREE.Vector3(200, -3, -150),
			scale: 3,
			rotation: new THREE.Vector3(0, Math.PI, 0),
		},
		{
			url: "/block-building/models/hot_air_ballon_voxel.glb",
			id: "balloon",
			position: new THREE.Vector3(-65, 20, -65),
			scale: 0.5,
		},
		{
			url: "/block-building/models/hot_air_ballon_voxel.glb",
			id: "balloon",
			position: new THREE.Vector3(20, 20, 150),
			scale: 0.5,
		},
		{
			url: "/block-building/models/hot_air_ballon_voxel.glb",
			id: "balloon",
			position: new THREE.Vector3(140, 20, -20),
			scale: 0.5,
		},
		{
			url: "/block-building/models/pirate_ship.glb",
			id: "pirate_ship",
			position: new THREE.Vector3(0, 0, 0),
			scale: 1,
			rotation: new THREE.Vector3(0, -Math.PI / 2, 0),
		},
		{
			url: "/block-building/models/castle_garden_-_voxel_art.glb",
			id: "castle_front_left",
			position: new THREE.Vector3(64, -3, 64),
			scale: 3,
		},
		{
			url: "/block-building/models/castle_garden_-_voxel_art.glb",
			id: "castle_back_left",
			position: new THREE.Vector3(-64, -3, 64),
			scale: 3,
			rotation: new THREE.Vector3(0, -Math.PI / 2, 0),
		},
		{
			url: "/block-building/models/castle_garden_-_voxel_art.glb",
			id: "castle_back_right",
			position: new THREE.Vector3(-64, -3, -64),
			scale: 3,
			rotation: new THREE.Vector3(0, Math.PI, 0),
		},
		{
			url: "/block-building/models/castle_garden_-_voxel_art.glb",
			id: "castle_front_right",
			position: new THREE.Vector3(64, -3, -64),
			scale: 3,
			rotation: new THREE.Vector3(0, Math.PI / 2, 0),
		},
	];

	const loader = new GLTFLoader();

	models.forEach((modelData) => {
		loader.load(
			modelData.url,
			function (gltf) {
				const model = gltf.scene;
				model.position.copy(modelData.position);
				model.scale.set(modelData.scale, modelData.scale, modelData.scale);
				if (modelData.rotation) model.rotation.set(modelData.rotation.x, modelData.rotation.y, modelData.rotation.z);

				const modelWrapper = new THREE.Object3D();
				modelWrapper.add(model);
				modelWrapper.userData.id = modelData.id;

				scene.add(modelWrapper);

				if (modelData.id === "pirate_ship") {
					modelWrapper.position.set(new THREE.Vector3(-320, 0, -320));
				}

				render();
			},
			undefined,
			function (error) {
				console.error("Error loading GLB model:", error);
			}
		);
	});
}

/**
 * Creates custom models and adds them to the scene.
 */
export function createCustomModels() {
	const borderGeometry = new THREE.BoxGeometry(52, 7, 128);
	const borderMaterial = new THREE.MeshStandardMaterial({ color: 0xa3d264 });

	const borderFront = new THREE.Mesh(borderGeometry, borderMaterial);
	borderFront.position.copy(new THREE.Vector3(-90, -3, 0));

	const borderBack = new THREE.Mesh(borderGeometry, borderMaterial);
	borderBack.position.copy(new THREE.Vector3(90, -3, 0));

	const borderLeft = new THREE.Mesh(borderGeometry, borderMaterial);
	borderLeft.position.copy(new THREE.Vector3(0, -3, 90));
	borderLeft.rotation.set(0, -Math.PI / 2, 0);

	const borderRight = new THREE.Mesh(borderGeometry, borderMaterial);
	borderRight.position.copy(new THREE.Vector3(0, -3, -90));
	borderRight.rotation.set(0, Math.PI / 2, 0);

	scene.add(borderFront);
	scene.add(borderBack);
	scene.add(borderLeft);
	scene.add(borderRight);
}

/**
 * Loads block geometries.
 */
export function loadBlockGeometries() {
	blockGeometries["cube"] = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
	blockGeometries["cylinder"] = new THREE.CylinderGeometry(cellSize / 2, cellSize / 2, cellSize);
	blockGeometries["sphere"] = new THREE.SphereGeometry(cellSize / 2, 64, 64);
}

/**
 * Loads block textures.
 */
export function loadBlockTextures() {
	// Load textures
	const textureLoader = new THREE.TextureLoader();
	const blockTextures = {
		brick: textureLoader.load("/block-building/textures/brickTexture.png"),
		crate: textureLoader.load("/block-building/textures/crateTexture.png"),
		dirt: textureLoader.load("/block-building/textures/dirtTexture.png"),
		glass: textureLoader.load("/block-building/textures/glassTexture.png"),
		grass: textureLoader.load("/block-building/textures/grassTexture.png"),
		plank: textureLoader.load("/block-building/textures/plankTexture.png"),
		sand: textureLoader.load("/block-building/textures/sandTexture.png"),
		stone: textureLoader.load("/block-building/textures/stoneTexture.png"),
		wood: textureLoader.load("/block-building/textures/woodTexture.png"),
	};

	// Create materials from textures
	Object.entries(blockTextures).forEach(([key, blockTexture]) => {
		blockMaterials[key] = new THREE.MeshBasicMaterial({ map: blockTexture });
	});
}
