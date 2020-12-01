const Patches = require('Patches');
const Time = require('Time');
const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
export const Diagnostics = require('Diagnostics');

import Food, { randomisePosition } from './Food';
import Mouth from './Mouth';

const food = [
	{
		title: 'Popiah',
		ingredients: ['popiah_skin', 'turnip', 'beansprouts', 'carrot', 'coriander', 'shrimp_paste', 'peanuts']
	}
];

const setPatches = (object) => {
	return [
		Patches.inputs.setScalar(object.key + '_x', object.position.x),
		Patches.inputs.setScalar(object.key + '_y', object.position.y),
	];
};

// game methods

const Game = {
	isPlaying: false,
	et: 0,
	init: async (objects) => {
		Game.et = 15;
		return await Food.init(objects);
	},
	update: async (objects) => {
		if (Game.et <= 0) {
			Time.setTimeout(async () => {
				await Game.update(objects);
			}, 10);
			return;
		}

		Game.et -= 0.1;

		let processed = Food.update(objects);

		if (Mouth.isClose) {
			processed = processed.map((object) => {
				if (Mouth.isInside(object.sceneObject, 100))
					return randomisePosition(object);
				return object;
			});
			Mouth.isClose = false;
		}

		await Patches.inputs.setScalar("progress", Game.et / 15);

		await Promise.all(processed.map(setPatches));

		Time.setTimeout(async () => {
			await Game.update(processed);
		}, 10);
	},
};

(async () => {
	const plane = await Scene.root.findFirst('plane0');
	Diagnostics.log(TouchGestures.onTap);
	// TouchGestures.onLongPress(plane);//.subscribe(gesture => {
		// Diagnostics.log("hello there");
		// if (!Game.isPlaying) Game.isPlaying = true;
	// });

	const initObjects = await Game.init(Food.objects);
	await Game.update(initObjects);
})();
