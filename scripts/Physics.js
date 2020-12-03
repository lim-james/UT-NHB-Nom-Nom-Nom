const Physics = {
	G: 0.005,
	update: objects => {
		return objects.map(Physics.applyGravity);
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