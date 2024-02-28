import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { cellSize } from "./constants.js";
import { scene } from "./scene.js";

export const blockGeometries = {};
export const blockTextures = {};

// Function to load 3D models
export function loadModels() {
	const models = [
		{
			url: "/block-building/models/fellglow_tower_-_voxel_art.glb",
			id: "tower",
			position: new THREE.Vector3(-200, -5, 80),
			scale: 5,
		},
		{
			url: "/block-building/models/hot_air_ballon_voxel.glb",
			id: "balloon",
			position: new THREE.Vector3(0, 20, -75),
			scale: 0.5,
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
			},
			undefined,
			function (error) {
				console.error("Error loading GLB model:", error);
			}
		);
	});
}

// Function to create custom models
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

// Function to load block geometries
export function loadBlockGeometries() {
	blockGeometries["cube"] = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
	blockGeometries["cylinder"] = new THREE.CylinderGeometry(cellSize / 2, cellSize / 2, cellSize);
	blockGeometries["sphere"] = new THREE.SphereGeometry(cellSize / 2, 64, 64);
	blockGeometries["tetrahedron"] = new THREE.TetrahedronGeometry(cellSize / 2, 0);
}

// Function to load block textures
export function loadBlockTextures() {
	const textureLoader = new THREE.TextureLoader();
	blockTextures["brick"] = textureLoader.load("/block-building/textures/brickTexture.png");
	blockTextures["crate"] = textureLoader.load("/block-building/textures/crateTexture.png");
	blockTextures["dirt"] = textureLoader.load("/block-building/textures/dirtTexture.png");
	blockTextures["glass"] = textureLoader.load("/block-building/textures/glassTexture.png");
	blockTextures["grass"] = textureLoader.load("/block-building/textures/grassTexture.png");
	blockTextures["plank"] = textureLoader.load("/block-building/textures/plankTexture.png");
	blockTextures["sand"] = textureLoader.load("/block-building/textures/sandTexture.png");
	blockTextures["stone"] = textureLoader.load("/block-building/textures/stoneTexture.png");
	blockTextures["wood"] = textureLoader.load("/block-building/textures/woodTexture.png");
}
