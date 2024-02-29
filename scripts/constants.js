// Constants for various elements and settings
export let container; // The container element
export let coordinates; // Coordinates display element
export let scenicViewToggle; // Toggle scenic view button
export let resetButton; // Reset button
export let compass; // Compass element
export let compassNorthButton, compassEastButton, compassSouthButton, compassWestButton; // Compass direction buttons

export const elements = []; // Array to hold scene elements

// Grid dimensions and cell size settings
export const gridDimensions = 32;
export const cellSize = 4;

// Minimum and maximum grid values
export const minGridValue = -(gridDimensions * cellSize) / 2 - cellSize / 2;
export const maxGridValue = (gridDimensions * cellSize) / 2 - cellSize / 2;

/**
 * Initializes constants by fetching required DOM elements.
 */
export function initializeConstants() {
	container = document.getElementById("container");
	coordinates = document.getElementById("coordinates");
	scenicViewToggle = document.getElementById("scenicViewToggle");
	resetButton = document.getElementById("resetButton");
	compass = document.getElementById("compass");
	compassNorthButton = document.getElementById("north");
	compassEastButton = document.getElementById("east");
	compassSouthButton = document.getElementById("south");
	compassWestButton = document.getElementById("west");
}
