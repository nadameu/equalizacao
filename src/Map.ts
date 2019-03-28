export const map = <A, B>(f: (_: A) => B) => <K>(map: Map<K, A>): Map<K, B> =>
	new Map(Array.from(map.entries()).map(([k, v]) => [k, f(v)] as [K, B]));
export const toEntriesArray = <K, V>(map: Map<K, V>): [K, V][] => Array.from(map.entries());
