export let container;
export let debugContainer;
export let scenicViewToggle;
export let resetButton;
export let compass;
export let compassNorthButton, compassEastButton, compassSouthButton, compassWestButton;

export const elements = [];

export const gridDimensions = 32;
export const cellSize = 4;
export const minGridValue = -(gridDimensions * cellSize) / 2 - cellSize / 2;
export const maxGridValue = (gridDimensions * cellSize) / 2 - cellSize / 2;

export function initializeConstants() {
	container = document.getElementById("container");
	debugContainer = document.getElementById("debugContainer");
	scenicViewToggle = document.getElementById("scenicViewToggle");
	resetButton = document.getElementById("resetButton");
	compass = document.getElementById("compass");
	compassNorthButton = document.getElementById("north");
	compassEastButton = document.getElementById("east");
	compassSouthButton = document.getElementById("south");
	compassWestButton = document.getElementById("west");
}
