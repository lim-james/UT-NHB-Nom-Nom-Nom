const Random = require('Random');
const Scene = require('Scene');

import { Screen, Rand } from './Common';
import Physics from './Physics';

const root = Scene.root;

// Member methods

const isOutOfScreen = object => object.position.y < Screen.min.y;

const randomisePosition = object => {
	object.position = {
		x: Rand.range(Screen.min.x, Screen.max.x),
		y: Screen.max.y * (Random.random() * 5 + 1),
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
			y: Screen.max.y,
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
	init: async objects => {
		return await Promise.all(objects.map(initializeObject));
	},
	update: objects => {
		const afterGravity = objects.map(Physics.applyGravity);
	
		const inBounds = afterGravity.filter(obj => !isOutOfScreen(obj));
		const outside = afterGravity.filter(isOutOfScreen);
		const resetted = outside.map(randomisePosition);

		return inBounds.concat(resetted);
	},
};

export default Food;
export { randomisePosition }