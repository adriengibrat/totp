/**
 * Composition of 2 unary functions
 */

export function compose<A, B, C>(
	f: (b: B) => C,
	g: (a: A) => B,
): ((a: A) => C) {
	return a => f(g(a))
}

/**
 * Flip function arguments
 */
export function flip<A, B, C>(f: (b: B, a: A) => C): ((a: A, b: B) => C) {
	return (a, b) => f(b, a)
}

/**
 * Pad value with n char
 */
export function pad(char: string | number, n: number) {
	return (a: string | number) =>
		`${Array(n)
			.fill(char)
			.join('')}${a}`.slice(-n)
}

/**
 * Assert condition or throw error
 */
export function assert(condition: boolean, message: string) {
	if (!condition) throw Error(message)
}

/**
 * Curried list mapper
 */
export function map<I, R>(mapper: (value: I, index?: number, list?: I[]) => R) {
	return (list: I[]) => list.map(mapper)
}
