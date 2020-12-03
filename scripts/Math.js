const Math = {
	lerp: (a, b, t) => (b - a) * t + a,
	min: (a, b) => a < b ? a : b,
    max: (a, b) => a > b ? a : b,
    clamp: (value, min, max) => Math.max(Math.min(value, max), min),
};

export default Math;