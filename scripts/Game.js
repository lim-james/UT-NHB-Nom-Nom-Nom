const Patches = require('Patches');
const Scene = require('Scene');

export const Diagnostics = require('Diagnostics');

import { Bounds } from './Common';
import Food, { randomisePosition } from './Food';
import Mouth from './Mouth';

///
/// game properties
///

const root = Scene.root;

let DISHES = [
	{
		key: 'popiah',
		ingredients: ['popiah_skin', 'turnip', 'beansprouts', 'carrot', 'coriander', 'shrimp_paste', 'peanuts']
	}
];

const dishIndex = 0;

const CURRENT_DISH = () => DISHES[dishIndex];

///
/// game helper methods
///

const onMouthClose = object => {
	if (CURRENT_DISH().ingredients.includes(object.key)) {
		// not one of the dishes
		return randomisePosition(object, 8, 2);
	} else {
		// is a dish
		return randomisePosition(object, 4, 1);
	}
};

const initializeObject = async object => {
	object.sceneObject = await root.findFirst('fd_' + object.key);
	object.sceneObject.hidden = true;
	return object;
};

const setFoodPatches = object => {
	return [
		Patches.inputs.setScalar(object.key + '_x', object.position.x),
		Patches.inputs.setScalar(object.key + '_y', object.position.y),
	];
};

const onGameStart = async objects => {
	Game.et = Game.duration;
	Game.isPlaying = true;

	DISHES.forEach(
		dish => dish.sceneObject.hidden = true
	);

	return await Food.init(objects);
};

const onGameEnd = objects => {
	CURRENT_DISH().sceneObject.hidden = false;

	const isRandom = obj => !CURRENT_DISH().ingredients.includes(obj.key);
	const isIngredient = obj => CURRENT_DISH().ingredients.includes(obj.key);

	// not optimised, just for ease of implementation
	const randomsRaw = objects.filter(isRandom);
	const ingredientsRaw = objects.filter(isIngredient);

	const randoms = randomsRaw.map(randomisePosition);
	const ingredients = ingredientsRaw.map((value, index) => {
		value.position.x = 0;
		value.position.y = (index / ingredientsRaw.length - 0.5) * Bounds.max.y + 0.1;
		return value;
	});

	return randoms.concat(ingredients);
};

///
/// game methods
///

const Game = {
	et: 0,
	duration: 15,
	isPlaying: false,

	init: async objects => {
		DISHES = await Promise.all(DISHES.map(initializeObject));
		return await onGameStart(objects);
	},

	update: async (objects, dt) => {
		if (Game.et <= 0) {
			if (Game.isPlaying) {
				Game.isPlaying = false;
				const processed = onGameEnd(objects);
				// set food porperties
				await Promise.all(processed.map(setFoodPatches));
				return processed;
			} else {
				return objects;
			}
		}

		Game.et -= dt;
		// move clock hand
		await Patches.inputs.setScalar('progress', Game.et / Game.duration);

		let processed = Food.update(objects);

		if (Mouth.isClose) {
			processed = processed.map(object => {
				if (Mouth.isInside(object.sceneObject, 100)) 
					return onMouthClose(object);

				return object;
			});
			Mouth.isClose = false;
		}

		// set food porperties
		await Promise.all(processed.map(setFoodPatches));

		return processed;
	},
};

export default Game;

