const Audio = require('Audio');
const TouchGestures = require('TouchGestures');
const Scene = require('Scene');
const Diagnostics = require('Diagnostics');

import StartState from './StartState';
import Food from './Food';
import GameState from './GameState';

const InitState = {
    enter: async (fsm, game, objects) => {
        game.audio = {
            bg: await Audio.getAudioPlaybackController('BG Controller'),
            final: await Audio.getAudioPlaybackController('Final Controller'),
            right: await Audio.getAudioPlaybackController('Right Controller'),
            wrong: await Audio.getAudioPlaybackController('Wrong Controller'),
            done: await Audio.getAudioPlaybackController('Done Controller'),
        };
        
        // game.tapGesture = TouchGestures.onTap(await Scene.root.findFirst('start'));
        game.tapGesture = TouchGestures.onTap();

        return Food.init(objects);
    },

    update: async (fsm, game, objects, dt) => {
        fsm.queuedState = StartState;
        return objects;
    },

    exit: async (fsm, game, objects) => objects,
};

export default InitState;
