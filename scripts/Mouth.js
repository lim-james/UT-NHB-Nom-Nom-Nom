const FaceTracking = require('FaceTracking');
const Patches = require('Patches');

import Screen from './Screen';
import Physics from './Physics';

// Face tracking members

const face = FaceTracking.face(0);

const mouthPoint = {
	leftX: face.mouth.leftCorner.x,
	leftY: face.mouth.leftCorner.y,
	righttX: face.mouth.rightCorner.x,
	rightY: face.mouth.rightCorner.y,
	topX: face.mouth.upperLipCenter.x,
	topY: face.mouth.upperLipCenter.y,
	bottomX: face.mouth.lowerLipCenter.x,
	bottomY: face.mouth.lowerLipCenter.y,
};

const Mouth = {
	isOpen: false,
	isClose: false,
};

Mouth.isInside = (item, size) => {
	const pourcent = (size * 0.5) / (Screen.height / Screen.scale);
	const ratioToAddSub = pourcent * 0.5;

	const itemX = item.transform.position.x.pinLastValue();
	const itemY = item.transform.position.y.pinLastValue();

	const itemLeft = itemX - ratioToAddSub;
	const itemRight = itemX + ratioToAddSub;
	const itemTop = itemY + ratioToAddSub;
	const itemBottom = itemY - ratioToAddSub;

	const leftX = Mouth.left.x.pinLastValue();
	const leftY = Mouth.left.y.pinLastValue();

	const rightX = Mouth.right.x.pinLastValue();
	const rightY = Mouth.right.y.pinLastValue();

	const topX = Mouth.top.x.pinLastValue();
	const topY = Mouth.top.y.pinLastValue();

	const bottomX = Mouth.bottom.x.pinLastValue();
	const bottomY = Mouth.bottom.y.pinLastValue();

	const checkLeftBox = Physics.inBounds(
		leftX,
		leftY,
		itemLeft,
		itemRight,
		itemTop,
		itemBottom
	);
	const checkRigttBox = Physics.inBounds(
		rightX,
		rightY,
		itemLeft,
		itemRight,
		itemTop,
		itemBottom
	);
	const checkTopBox = Physics.inBounds(
		topX,
		topY,
		itemLeft,
		itemRight,
		itemTop,
		itemBottom
	);
	const checkBottomBox = Physics.inBounds(
		bottomX,
		bottomY,
		itemLeft,
		itemRight,
		itemTop,
		itemBottom
	);

	return checkLeftBox || checkRigttBox || checkTopBox || checkBottomBox;
}

FaceTracking.face(0)
	.mouth.openness.monitor()
	.subscribe(function (event) {
		if (event.newValue > 0.4) {
			// When the mouth is open, we update the position of each corner and send it back to Spark AR.
			Patches.inputs.setScalar("mouthLeftX", mouthPoint.leftX);
			Patches.inputs.setScalar("mouthLeftY", mouthPoint.leftY);

			Patches.inputs.setScalar("mouthRightX", mouthPoint.righttX);
			Patches.inputs.setScalar("mouthRightY", mouthPoint.rightY);

			Patches.inputs.setScalar("mouthTopX", mouthPoint.topX);
			Patches.inputs.setScalar("mouthTopY", mouthPoint.topY);

			Patches.inputs.setScalar("mouthBottomX", mouthPoint.bottomX);
			Patches.inputs.setScalar("mouthBottomY", mouthPoint.bottomY);

			if (!Mouth.isOpen) {
				Mouth.isOpen = true;
			}
		} else {
			if (Mouth.isOpen) {
				Mouth.isClose = true;
				Mouth.isOpen = false;
			}
		}
	});

(async () => {
	Mouth.left = await Patches.outputs.getVector('leftMouthPoint');
	Mouth.right = await Patches.outputs.getVector('rightMouthPoint');
	Mouth.top = await Patches.outputs.getVector('topMouthPoint');
	Mouth.bottom = await Patches.outputs.getVector('bottomMouthPoint');
})();

export default Mouth;

