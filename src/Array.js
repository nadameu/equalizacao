export const partition = p => xs =>
	xs.reduce(
		(acc, x) =>
			p(x)
				? { true: acc.true.concat([x]), false: acc.false }
				: { true: acc.true, false: acc.false.concat([x]) },
		{ true: [], false: [] },
	);
