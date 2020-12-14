const Physics = {
	G: 0.01,

	applyGravity : object => {
		object.position.y -= Physics.G;
		return object;
	},

	inBounds : (pointX, pointY, left, right, top, bottom) => {
		return pointX > left && pointX < right && pointY > bottom && pointY < top;
	},

	update: objects => {
		const staticList = objects.filter(i => !i.physics.isKinematic);
		const kinematicList = objects.filter(i => i.physics.isKinematic);

		const processed = kinematicList.map(Physics.applyGravity);

		return staticList.concat(processed);
	},
};


export default Physics;