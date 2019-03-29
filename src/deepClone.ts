export const deepClone = <T>(obj: T): T => {
	if (typeof obj !== 'object') return obj;
	if (obj === null) return obj;
	if (Array.isArray(obj)) {
		return (obj.map(deepClone) as unknown) as T;
	}
	const result: any = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result[key] = deepClone(obj[key]);
		}
	}
	if (typeof Object.getOwnPropertySymbols === 'function') {
		for (const sym of Object.getOwnPropertySymbols(obj)) {
			result[sym] = deepClone(obj[sym as symbol & keyof T]);
		}
	}
	return result;
};
