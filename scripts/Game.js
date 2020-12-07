const Patches = require('Patches');
const Scene = require('Scene');

import StartState from './StartState';

///
/// game properties
///

const root = Scene.root;

const DISHES = [
	{
		key: 'popiah',
		ingredients: ['popiah_skin', 'turnip', 'beansprouts', 'carrot', 'coriander', 'shrimp_paste', 'peanuts']
	}
];

///
/// game helper methods
///

const initializeObject = async object => {
	object.sceneObject = await root.findFirst(object.key + '_image');
	object.sceneObject.hidden = true;
	return object;
};

const setFoodPatches = object => {
	return [
		Patches.inputs.setScalar(object.key + '_x', object.position.x),
		Patches.inputs.setScalar(object.key + '_y', object.position.y),
	];
};

///
/// game methods
///

const Game = {
	et: 0,
	duration: 15,

	dishIndex: 0,
	currentDish : () => Game.dishes[Game.dishIndex],
	isIngredient: item => Game.currentDish().ingredients.includes(item.key),

	collected: [],
};

const FSM = {
	state: StartState,
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
		await Promise.all(objects.map(setFoodPatches));
		return objects;
	},
};

export default FSM;

