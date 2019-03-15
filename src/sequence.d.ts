export function transpose<T>(xss: T[][]): T[][];
export function sequence1Objs<T extends Record<keyof T, any>>(xss: T[]): { [k in keyof T]: T[k][] };
