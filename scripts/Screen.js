const Patches = require('Patches');
const Time = require('Time');

const Screen = {
	height: 0,
	scale: 0,
};

(async () => {
	const screenSizeHeightPX = await Patches.outputs.getScalar("screenHeight");
	const screenScale = await Patches.outputs.getScalar("screenScale");

	Time.setTimeout(() => {
		Screen.height = screenSizeHeightPX.pinLastValue();
		Screen.scale = screenScale.pinLastValue();
	}, 100);
})();


export default Screen;