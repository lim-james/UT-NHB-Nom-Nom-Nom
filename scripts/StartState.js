const TouchGestures = require('TouchGestures');

import GameState from './GameState';

const StartState = {
    enter: async (fsm, game, objects) => {
        game.tapGesture.subscribe((gesture) => {
            fsm.queuedState = GameState;
        });
        return objects
    },

    update: async (fsm, game, objects, dt) => objects,

    exit: async (fsm, game, objects) => {
        game.tapGesture.subscribe(() => {});
        return objects;
    },
};



export default StartState;