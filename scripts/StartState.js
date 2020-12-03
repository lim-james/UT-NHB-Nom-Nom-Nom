import GameState from './GameState';

const StartState = {
    enter: async (fsm, game, objects) => objects,
    update: async (fsm, game, objects, dt) => {
        fsm.queuedState = GameState;
        return objects;
    },
    exit: async (fsm, game, objects) => objects,
};

export default StartState;