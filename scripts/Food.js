const Random = require('Random');
const Scene = require('Scene');
const Diagnostics = require('Diagnostics');

import { Bounds, Rand } from './Common';

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
	object.sceneObject = await Scene.root.findFirst(object.key);
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

// popiah
addDish('popiah_skin');
addDish('turnip');
addDish('beansprouts');
addDish('carrot');
addDish('coriander');
addDish('shrimp_paste');
addDish('peanuts');
// ondeh
addDish('grated_coconut');
addDish('gula_melaka');
addDish('pandan');
addDish('rice_flour');
addDish('sweet_potato');
// rojak
addDish('chilli_paste');
addDish('cucumber');
addDish('prawn');
addDish('deep_fried_tofu');
addDish('cuttlefish');
addDish('vadai');
addDish('onions');
addDish('tumeric');
// wrong
addDish('banana');
addDish('chicken');
addDish('chocolate');
addDish('pumpkin');
addDish('corn');

const Food = {
	objects: OBJECTS,
	init: async objects => await Promise.all(objects.map(initializeObject)),
	update: (game, objects) => {
		const inBounds = objects.filter(obj => !isOutOfScreen(obj));
		const outside = objects.filter(isOutOfScreen);
		const resetted = outside.map(game.randomisePosition);

		return inBounds.concat(resetted);
	},
};

export default Food;
export { randomisePosition }