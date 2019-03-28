export const T = <A>(x: A) => <B>(f: (_: A) => B): B => f(x);
export const T2 = <A>(x: A) => <B>(y: B) => <C>(f: (_: A) => (_: B) => C): C => f(x)(y);
