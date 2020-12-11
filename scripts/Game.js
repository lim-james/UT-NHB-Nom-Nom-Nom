const Scene = require('Scene');
const Patches = require('Patches');

import { randomisePosition } from './Food';
import InitState from './InitState';

///
/// game properties
///

const root = Scene.root;

const DISHES = [
	{
		key: 'popiah',
		ingredients: ['popiah_skin', 'turnip', 'beansprouts', 'carrot', 'coriander', 'shrimp_paste', 'peanuts']
	},
	{
		key: 'ondeh',
		ingredients: ['grated_coconut', 'gula_melaka', 'pandan', 'rice_flour', 'sweet_potato']
	},
	{
		key: 'popiah',
		ingredients: ['popiah_skin', 'turnip', 'beansprouts', 'carrot', 'coriander', 'shrimp_paste', 'peanuts']
	}
];

///
/// game helper methods
///

const initializeObject = async object => {
	object.sceneObject = await root.findFirst(object.key + '_appear');
	object.sceneObject.hidden = true;
	return object;
};

const setFoodPatches = object => {
	object.sceneObject.transform.x = object.position.x;
	object.sceneObject.transform.y = object.position.y;
};

///
/// game methods
///

const Game = {
	et: 0,
	duration: 15,

	currentDish : () => Game.dishes[Game.dishIndex.pinLastValue()],
	isIngredient: item => Game.currentDish().ingredients.includes(item.key),

	randomisePosition: object => {
		if (Game.isIngredient(object))
			return randomisePosition(object, 3, 1);
		else
			return randomisePosition(object, 8, 2);
	},

	collected: [],
};

(async () => {
	Game.dishIndex = await Patches.outputs.getScalar('dishIndex');
})();

const FSM = {
	state: InitState,
	queuedState: null,

	init: async objects => {
		Game.dishes = await Promise.all(DISHES.map(initializeObject));
		return FSM.state.enter(FSM, Game, objects);
	},

	update: async (objects, dt) => {
		let processed = objects;

		if (FSM.queuedState != null) {
			const next = FSM.queuedState;
			FSM.queuedState = null;

			const exited = await FSM.state.exit(FSM, Game, objects);
			processed = await next.enter(FSM, Game, exited);
			// swap states
			FSM.state = next;
		} 

		return FSM.state.update(FSM, Game, processed, dt);
	},

	postUpdate: async objects => {
		// set food porperties
		objects.forEach(setFoodPatches);
		return objects;
	},
};

export default FSM;

