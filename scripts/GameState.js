const Patches = require('Patches');
const Scene = require('Scene');

import Food, { randomisePosition } from './Food';
import Mouth from './Mouth';

import EndState from './EndState';

const onMouthClose = (game, object) => {
	if (game.isIngredient(object)) {
		// is a dish
		GameState.right.delay = 0.4;
		GameState.right.sceneObject.hidden = false;
		GameState.right.sceneObject.x = object.position.x;
		GameState.right.sceneObject.y = object.position.y;

		game.collected.push(object.key);
		return randomisePosition(object, 4, 1);
	} else {
		// not one of the dishes
		GameState.wrong.delay = 0.4;
		GameState.wrong.sceneObject.hidden = false;
		GameState.wrong.sceneObject.x = object.position.x;
		GameState.wrong.sceneObject.y = object.position.y;

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
		
		GameState.right = {
			delay: 0,
			sceneObject: await Scene.root.findFirst('chomp_right'),
		};

		GameState.wrong = {
			delay: 0,
			sceneObject: await Scene.root.findFirst('chomp_wrong'),
		};

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

		if (GameState.right.delay > 0) {
			GameState.right.delay -= dt;
			if (GameState.right.delay <= 0) {
				GameState.right.sceneObject.hidden = true;
			}
		}

		if (GameState.wrong.delay > 0) {
			GameState.wrong.delay -= dt;
			if (GameState.wrong.delay <= 0) {
				GameState.wrong.sceneObject.hidden = true;
			}
		}

		return processed;
    },

    exit: async (fsm, game, objects) => {
		GameState.right.sceneObject.hidden = true;
		GameState.wrong.sceneObject.hidden = true;
		return objects;
	},
};

export default GameState;