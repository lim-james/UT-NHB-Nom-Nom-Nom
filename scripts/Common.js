const Random = require('Random');

const Screen = {
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

export { Screen, Rand };