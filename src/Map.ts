declare global {
	interface Map<K, V> {
		entriesAsArray(): [K, V][];
		keysAsArray(): K[];
		map<U>(f: (_: V) => U): Map<K, U>;
		valuesAsArray(): V[];
	}
}

Map.prototype.entriesAsArray = function entriesAsArray() {
	return Array.from(this.entries());
};
Map.prototype.keysAsArray = function keysAsArray() {
	return Array.from(this.keys());
};
Map.prototype.map = function map(f) {
	const result = new Map();
	for (const [k, v] of this.entries()) {
		result.set(k, f(v));
	}
	return result;
};
Map.prototype.valuesAsArray = function valuesAsArray() {
	return Array.from(this.values());
};

export default {};
