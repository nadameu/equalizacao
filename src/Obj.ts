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

export const map = <T, U>(obj: T, f: (_: T[keyof T]) => U): { [k in keyof T]: U } =>
	mapWithKey<T, U>(obj, x => f(x as any));
