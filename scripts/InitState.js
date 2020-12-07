const Audio = require("Audio");

import StartState from './StartState';
import Food from './Food';

const InitState = {
    enter: async (fsm, game, objects) => {
        game.audio = {
			bg: await Audio.getAudioPlaybackController("Timer"),
			final: await Audio.getAudioPlaybackController("Final"),
			// right: await Audio.getAudioPlaybackController("Right"),
            // wrong: await Audio.getAudioPlaybackController("Wrong"),
            done: await Audio.getAudioPlaybackController("Done"),
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
