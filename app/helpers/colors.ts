"use strict";

export const BLACK = 0x000000;
export const WHITE = 0xffffff;

// credits: https://stackoverflow.com/q/31999022/9545525
export const getContrastColor = (color: string | number) => {

	if (typeof color === 'string') {
		color = parseInt(color, 16);
	}

	if (Number.isInteger(color)) {
		console.error(`[getContrastColor] invalid color ${color} given`);
		return BLACK;
	}

	const red = (color >> 16) & 0xff;
	const green = (color >> 8) & 0xff;
	const blue = color & 0xff;

	// count the perceptive luminance - human eye favors green color...
	const luminance = 1 - (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

	return luminance < 0.5 ? BLACK : WHITE;

};
