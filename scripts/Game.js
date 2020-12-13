const Patches = require('Patches');

import { randomisePosition } from './Food';
import InitState from './InitState';

///
/// game properties
///

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
		key: 'rojak',
		ingredients: ['chilli_paste', 'cucumber', 'prawn', 'deep_fried_tofu', 'cuttlefish', 'vadai', 'onions', 'tumeric']
	}
];

///
/// game helper methods
///

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

	wrongDishes: ['banana', 'chicken', 'chocolate', 'pumpkin', 'corn'],

	currentDish : () => Game.dishes[Game.dishIndex.pinLastValue()],
	isIngredient: item => Game.currentDish().ingredients.includes(item.key),
	isInGame: item => Game.currentDish().ingredients.includes(item.key) || Game.wrongDishes.includes(item.key),

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
export { DISHES };

