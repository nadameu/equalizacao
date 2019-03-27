export const alt = <A>(ys: A[]) => (xs: A[]): A[] => (xs.length === 0 ? ys : xs);
export const filter = <A>(p: (_: A) => boolean) => (xs: A[]): A[] => xs.filter(p);
export const refine = <A, B extends A>(p: (_: A) => _ is B) => (xs: A[]): B[] => xs.filter(p);
export const chain = <A, B>(f: (_: A) => B[]) => (xs: A[]): B[] =>
	xs.reduceRight<B[]>((ys, x) => f(x).concat(ys), []);
export const flatten: <A>(xs: A[][]) => A[] = chain(xs => xs);
export const mapi = <A, B>(f: (_: A) => (_: number) => B) => (xs: A[]): B[] =>
	xs.map((x, i) => f(x)(i));
export const map = <A, B>(f: (_: A) => B): ((xs: A[]) => B[]) => mapi(x => _ => f(x));
export const ap = <A, B>(fs: ((_: A) => B)[]): ((xs: A[]) => B[]) =>
	chain(x => map((f: (_: A) => B) => f(x))(fs));
export const toMapi = <A, K, B>(f: (_: A) => (_: number) => [K, B]) => (xs: A[]): Map<K, B[]> =>
	xs.reduceRight((map, x, i) => {
		const [k, v] = f(x)(i);
		map.set(k, [v].concat(map.get(k) || []));
		return map;
	}, new Map<K, B[]>());
export const toMap = <A, K, B>(f: (_: A) => [K, B]): ((xs: A[]) => Map<K, B[]>) =>
	toMapi(x => _ => f(x));
export const unique = <A>(xs: A[]): A[] => Array.from(new Set(xs).values());
export const zipWith = <A, B, C>(f: (_: A) => (_: B) => C) => (xs: A[]) => (ys: B[]): C[] =>
	Array.from({ length: Math.min(xs.length, ys.length) }, (_, i) => f(xs[i])(ys[i]));
