const Time = require('Time');
import { G } from './Common';

import Food from './Food';
import FSM from './Game';
import Physics from './Physics';

const Engine = {
	objects: Food.objects, 

	init: FSM.init,

	update: async objects => {
		const physics = Physics.update(objects);
        const processed = await FSM.update(physics, G.step);
		await Engine.postUpdate(processed);
	},

	postUpdate: async objects => {
		const processed = await FSM.postUpdate(objects);

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
