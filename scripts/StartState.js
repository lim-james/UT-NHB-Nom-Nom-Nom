import GameState from './GameState';

const StartState = {
    enter: async (fsm, game, objects) => {
        fsm.queuedState = GameState;
        return objects;
    },
    update: async (fsm, game, objects, dt) => objects,
    exit: async (fsm, game, objects) => objects,
};

export default StartState;