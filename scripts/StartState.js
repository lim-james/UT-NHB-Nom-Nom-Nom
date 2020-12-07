const TouchGestures = require('TouchGestures');
const Diagnostics = require('Diagnostics');
const Scene = require('Scene');

import GameState from './GameState';

const StartState = {
    enter: async (fsm, game, objects) => {
        TouchGestures.onTap().subscribe((gesture) => {
            fsm.queuedState = GameState;
        });
        return objects
    },

    update: async (fsm, game, objects, dt) => objects,

    exit: async (fsm, game, objects) => {
        TouchGestures.onTap().subscribe(() => {});
        return objects;
    },
};



export default StartState;