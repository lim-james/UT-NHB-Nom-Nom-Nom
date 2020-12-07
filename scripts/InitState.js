const Audio = require('Audio');

import StartState from './StartState';
import Food from './Food';

const InitState = {
    enter: async (fsm, game, objects) => {
        game.audio = {
            bg: await Audio.getAudioPlaybackController('BG Controller'),
            final: await Audio.getAudioPlaybackController('Final Controller'),
            right: await Audio.getAudioPlaybackController('Right Controller'),
            wrong: await Audio.getAudioPlaybackController('Wrong Controller'),
            done: await Audio.getAudioPlaybackController('Done Controller'),
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
