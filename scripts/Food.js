const Random = require('Random');
const Scene = require('Scene');

import { Bounds, Rand } from './Common';

const root = Scene.root;

// Member methods

const isOutOfScreen = object => object.position.y < Bounds.min.y;

const randomisePosition = (object, multiplier = 3, offset = 1) => {
	object.position = {
		x: Rand.range(Bounds.min.x, Bounds.max.x),
		y: Bounds.max.y * (Random.random() * multiplier + offset),
	};
	return object;
};

const initializeObject = async object => {
	object.sceneObject = await root.findFirst(object.key);
	return randomisePosition(object);
};

// Food members

const OBJECTS = [];

const addDish = dish => {
	OBJECTS.push({
		key: dish,
		position: {
			x: 0,
			y: Bounds.max.y,
		},
		physics: {
			isKinematic: false,
		},
	});
};

addDish('popiah_skin');
addDish('turnip');
addDish('beansprouts');
addDish('carrot');
addDish('coriander');
addDish('shrimp_paste');
addDish('peanuts');

const Food = {
	objects: OBJECTS,
	init: async objects => await Promise.all(objects.map(initializeObject)),
	update: objects => {
		const inBounds = objects.filter(obj => !isOutOfScreen(obj));
		const outside = objects.filter(isOutOfScreen);
		const resetted = outside.map(randomisePosition);

		return inBounds.concat(resetted);
	},
};

export default Food;
export { randomisePosition }