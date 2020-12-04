const Patches = require('Patches');

import Food, { randomisePosition } from './Food';
import Mouth from './Mouth';

import EndState from './EndState';

const onMouthClose = (game, object) => {
	if (game.currentDish().ingredients.includes(object.key)) {
		// is a dish
		game.collected.push(object.key);
		return randomisePosition(object, 4, 1);
	} else {
		// not one of the dishes
		return randomisePosition(object, 8, 2);
	}
};

const GameState = {
    enter: async (fsm, game, objects) => {
	    game.et = game.duration;

	    game.dishes.forEach(
		    dish => dish.sceneObject.hidden = true
		);
		
		game.collected = [];

	    const enabledPhysics = objects.map(object => {
		    object.physics.isKinematic = true;
		    return object;
	    });

	    return await Food.init(enabledPhysics);
    },

    update: async (fsm, game, objects, dt) => {
        if (game.et <= 0) {
            fsm.queuedState = EndState;
            return objects;
        }

		game.et -= dt;
		// move clock hand
		await Patches.inputs.setScalar('progress', game.et / game.duration);

		let processed = Food.update(objects);

		if (Mouth.isClose) {
			processed = processed.map(object => {
				if (Mouth.isInside(object.sceneObject, 100)) 
					return onMouthClose(game, object);

				return object;
			});
			Mouth.isClose = false;
		}

		return processed;
    },

    exit: async (fsm, game, objects) => objects,
};

export default GameState;