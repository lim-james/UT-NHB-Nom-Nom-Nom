const Time = require('Time');
import { G } from './Common';

import Food from './Food';
import Game from './Game';

const Engine = {
    objects: Food.objects, 
    init: Game.init,
	update: async objects => {
        const processed = await Game.update(objects, G.step);

		// new iteration
		Time.setTimeout(
			async () => await Engine.update(processed),
			G.dt
		);
	},
};

(async () => {
	const initObjects = await Engine.init(Engine.objects);
	await Engine.update(initObjects);
})();
