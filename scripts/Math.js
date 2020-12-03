const Math = {
	lerp: (a, b, t) => (b - a) * t + a,
	min: (a, b) => a < b ? a : b,
	max: (a, b) => a > b ? a : b,
};

export default Math;