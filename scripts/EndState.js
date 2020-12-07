const Materials = require('Materials');
const Scene = require('Scene');
const Diagnostics = require('Diagnostics');

import { Bounds } from './Common';
import Math from './Math';
import StartState from './StartState';

const EndState = {
	clockY: -0.15,

    enter: async (fsm, game, objects) => {
    	game.currentDish().sceneObject.hidden = false;

		let ingredients = [];
		let randoms = [];

		objects.forEach(
			element => (game.isIngredient(element) ? ingredients : randoms).push(element)
		);

		ingredients = ingredients.map(i => {
			i.physics.isKinematic = false;
			return i;
		});
		
		game.et = 0;

		EndState.blastIndex = -1;
		EndState.blastMaterial = await Materials.findFirst('Blast');

		EndState.blastObject = await Scene.root.findFirst('blast');
		EndState.blastObject.hidden = false;

		EndState.clockObject = await Scene.root.findFirst('clock');

        return randoms.concat(ingredients);
    },

    update: async (fsm, game, objects, dt) => {
		game.et += dt;

		let ingredients = [];
		let randoms = [];

		objects.forEach(
			element => (game.isIngredient(element) ? ingredients : randoms).push(element)
		);

		let processed = ingredients; 

		const getY = index => (index / ingredients.length - 0.5) * Bounds.max.y + 0.1;

		if (game.et < 2) {
			const t = game.et / 2;
			processed = ingredients.map((value, index) => {
		    	value.position.x = Math.lerp(value.position.x, 0, t);
		    	value.position.y = Math.lerp(value.position.y, getY(index), t);
		    	return value;
			});
		} else if (game.et > 3) {
			EndState.clockObject.hidden = true;
			const et = game.et - 3;

			const isCollected = obj => game.collected.includes(obj.key);

			let collected = [];
			let others = [];

			ingredients.forEach(
				element => (isCollected(element) ? collected : others).push(element)
			);

			collected = collected.map((value, index) => {
				const t = Math.clamp((et - index * 0.5) / 3, 0, 1);
				if (t >= 1 && index > EndState.blastIndex) {
					// EndState.blastMaterial.getDiffuse().currentFrame = 0;
					// EndState.blastIndex = index;
				}
				value.position.y = Math.lerp(value.position.y, EndState.clockY, t);
		    	return value;
			});

			processed = collected.concat(others);
		} else {
			// fsm.queuedState = StartState;
		}

        return randoms.concat(processed);
	},

	exit: async (fsm, game, objects) => {
		game.currentDish().sceneObject.hidden = true;
		EndState.blastObject.hidden = true;
		EndState.clockObject.hidden = false;
		return objects;
	},
};

export default EndState;