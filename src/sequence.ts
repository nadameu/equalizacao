import * as Obj from './Obj';

export const transpose = <T>(xss: T[][]): T[][] => {
	if (xss.length === 0 || xss[0].length === 0) return [];
	const inner = xss[0];
	return inner.map((_, i) => xss.map(inners => inners[i]));
};

export const sequence1Objs = <T>(xs: T[]): { [k in keyof T]: T[k][] } => {
	if (xs.length === 0) {
		throw new Error('Empty array.');
	}
	const init = Obj.map(xs[0], () => []) as { [k in keyof T]: any[] };
	return xs.reduce<typeof init>(
		(acc, x) => Obj.mapWithKey(acc, (ys, key) => ys.concat([x[key]])),
		init,
	);
};
