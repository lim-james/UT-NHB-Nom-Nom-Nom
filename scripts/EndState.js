import { Bounds } from './Common';

const EndState = {
    enter: async (fsm, game, objects) => {
    	game.currentDish().sceneObject.hidden = false;

	    const isRandom = obj => !game.currentDish().ingredients.includes(obj.key);
	    const isIngredient = obj => game.currentDish().ingredients.includes(obj.key);

	    // not optimised, just for ease of implementation
	    const randoms = objects.filter(isRandom);
	    const ingredients = objects.filter(isIngredient);

	    const processed = ingredients.map((value, index) => {
		    value.position.x = 0;
		    value.position.y = (index / ingredients.length - 0.5) * Bounds.max.y + 0.1;
		    return value;
	    });

        return randoms.concat(processed);
    },

    update: async (fsm, game, objects, dt) => objects,
    exit: async (fsm, game, objects) => objects,
};

export default EndState;