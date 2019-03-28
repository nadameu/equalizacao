declare global {
	interface Object {
		do<T, U>(this: T, f: (_: T) => U): U;
	}
}
Object.prototype.do = function Object$do(f) {
	return f(this);
};

export default {};
