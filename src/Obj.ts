export const mapWithKey = <T, U>(
	obj: T,
	f: (_: T[keyof T], key: keyof T) => U,
): { [k in keyof T]: U } => {
	const result: Record<keyof T, U> = {} as any;
	for (const [key, value] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
		result[key] = f(value, key);
	}
	return result;
};

export const map = <A, B>(f: (_: A) => B) => <T extends Record<any, A>>(
	obj: T,
): Record<keyof T, B> => {
	const result: Record<keyof T, B> = {} as any;
	for (const [key, value] of Object.entries(obj) as [keyof T, A][]) {
		result[key] = f(value);
	}
	return result;
};
