export const map = (obj, f) => {
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		result[key] = f(value);
	}
	return result;
};

export const mapWithKey = (obj, f) => {
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		result[key] = f(value, key);
	}
	return result;
};
