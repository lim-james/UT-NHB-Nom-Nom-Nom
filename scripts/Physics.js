const Physics = {
	G: 0.005,
	update: objects => {
		const staticList = objects.filter(i => !i.physics.isKinematic);
		const kinematicList = objects.filter(i => i.physics.isKinematic);

		const processed = kinematicList.map(Physics.applyGravity);

		return staticList.concat(processed);
	},
};

Physics.applyGravity = object => {
	object.position.y -= Physics.G;
	return object;
}

Physics.inBounds = (pointX, pointY, left, right, top, bottom) => {
	return pointX > left && pointX < right && pointY > bottom && pointY < top;
};

export default Physics;