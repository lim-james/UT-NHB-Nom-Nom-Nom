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

///
/// game methods
///

const Game = {
	et: 0,
	duration: 15,
	isPlaying: false,

	dishIndex: 0,
	currentDish : () => Game.dishes[Game.dishIndex],
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
			const exited = await FSM.state.exit(FSM, Game, objects);
			processed = await FSM.queuedState.enter(FSM, Game, exited);
			// swap states
			FSM.state = FSM.queuedState;
			FSM.queuedState = null;
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

