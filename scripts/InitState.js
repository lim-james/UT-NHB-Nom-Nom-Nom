const Audio = require("Audio");
const Scene = require('Scene');

import StartState from './StartState';
import Food from './Food';

import { DISHES } from './Game';

const initializeObject = async object => {
	object.container = await Scene.root.findFirst(object.key);
	object.sceneObject = await Scene.root.findFirst(object.key + '_appear');
    object.sceneObject.hidden = true;
    object.chompWrong = await Audio.getAudioPlaybackController(object.key + '_wrong');
	return object;
};

const InitState = {
    enter: async (fsm, game, objects) => {
		game.dishes = await Promise.all(DISHES.map(initializeObject));
        game.audio = {
			bg: await Audio.getAudioPlaybackController('Timer'),
			final: await Audio.getAudioPlaybackController('Final'),
			right: await Audio.getAudioPlaybackController('Right'),
            done: await Audio.getAudioPlaybackController('Done'),
        };
        return Food.init(objects);
    },
    
    update: async (fsm, game, objects, dt) => {
        fsm.queuedState = StartState;
        return objects;
    },

    exit: async (fsm, game, objects) => objects,
};

export default InitState;
