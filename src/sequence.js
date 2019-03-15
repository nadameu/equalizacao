import * as Obj from './Obj';

export const transpose = outer => {
	if (outer.length === 0 || outer[0].length === 0) return [];
	const inner = outer[0];
	return inner.map((_, i) => outer.map(inners => inners[i]));
};

export const sequence1Objs = xs => {
	if (xs.length === 0) return [];
	const init = Obj.map(xs[0], () => []);
	return xs.reduce((acc, x) => Obj.mapWithKey(acc, (ys, key) => ys.concat([x[key]])), init);
};
