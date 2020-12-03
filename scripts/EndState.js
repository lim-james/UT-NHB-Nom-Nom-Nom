import { Bounds } from './Common';
import Math from './Math';

const EndState = {
	clockY: -0.15,

    enter: async (fsm, game, objects) => {
    	game.currentDish().sceneObject.hidden = false;

	    const isRandom = obj => !game.currentDish().ingredients.includes(obj.key);
	    const isIngredient = obj => game.currentDish().ingredients.includes(obj.key);

	    // not optimised, just for ease of implementation
	    const randoms = objects.filter(isRandom);
		const ingredients = objects.filter(isIngredient).map(i => {
			i.physics.isKinematic = false;
			return i;
		});
		
		game.et = 0;

        return randoms.concat(ingredients);
    },

    update: async (fsm, game, objects, dt) => {
		game.et += dt;

	    const isRandom = obj => !game.currentDish().ingredients.includes(obj.key);
	    const isIngredient = obj => game.currentDish().ingredients.includes(obj.key);

	    // not optimised, just for ease of implementation
	    const randoms = objects.filter(isRandom);
		const ingredients = objects.filter(isIngredient);

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
			const et = game.et - 3;
			processed = ingredients.map((value, index) => {
				const t = Math.clamp((et - index * 0.5) / 3, 0, 1);
		    	value.position.y = Math.lerp(value.position.y, EndState.clockY, t);
		    	return value;
			});
		}

        return randoms.concat(processed);
	},
    exit: async (fsm, game, objects) => objects,
};

export default EndState;