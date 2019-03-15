export function map<T extends Record<keyof T, any>, U>(
	obj: T,
	f: (_: T extends Record<keyof T, infer V> ? V : never) => U,
): { [k in keyof T]: U };

export function mapWithKey<T extends Record<keyof T, any>, U>(
	obj: T,
	f: (_: T extends Record<keyof T, infer V> ? V : never, key: keyof T) => U,
): { [k in keyof T]: U };
