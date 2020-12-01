const Physics = {
 	G: 0.002,
};

Physics.applyGravity = object => {
	object.position.y -= Physics.G;
	return object;
}

Physics.inBounds = (pointX, pointY, left, right, top, bottom) => {
	return pointX > left && pointX < right && pointY > bottom && pointY < top;
};

export default Physics;