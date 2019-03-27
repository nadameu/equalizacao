class Take<A> {
	constructor(readonly value: A) {}
	apply<B>(f: (_: A) => B): Take<B> {
		return new Take(f(this.value));
	}
	return<B>(f: (_: A) => B): B {
		return f(this.value);
	}
	tap(f: (_: A) => void): Take<A> {
		f(this.value);
		return this;
	}
}
export const take = <A>(value: A): Take<A> => new Take(value);
