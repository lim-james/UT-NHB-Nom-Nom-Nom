import StartState from './StartState';
import Food from './Food';

const InitState = {
    enter: async (fsm, game, objects) => Food.init(objects),
    update: async (fsm, game, objects, dt) => {
        fsm.queuedState = StartState;
        return objects;
    },
    exit: async (fsm, game, objects) => objects,
};

export default InitState;
