const Random = require('Random');

const Bounds = {
	min: {
		x: -0.1,
		y: -0.3,
	},
	max: {
		x: 0.1,
		y: 0.3,
	},
};

const Rand = {
	range: (min, max) => (max - min) * Random.random() + min,
};

const G = {
	dt: 10,
};

G.step = G.dt * 0.01;

export { Bounds, Rand, G };