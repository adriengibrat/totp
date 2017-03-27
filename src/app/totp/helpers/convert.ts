import { compose, flip, pad } from './utils'

/**
 * Convert integer to hexadecimal
 */
function hexFromNumber(a: number) {
	return a.toString(16)
}

/**
 * Convert integer to 16 char long zero padded hexadecimal
 */
const zeroPaddedHexFromNumber = compose(pad('0', 16), hexFromNumber)

/**
 * Convert hexadecimal to integer
 */

function intFromHex(a: string) {
	return parseInt(a, 16)
}

/**
 * Take 2 characters from a string at given offset
 */
function slice(a: string) {
	return (n: number) => a.substr(n * 2, 2)
}

/**
 * Convert zero padded hexadecimal to ArrayBuffer
 */
export function bufferFromHex(a: string) {
	return Uint8Array.from(
		Array(a.length / 2),
		flip(compose(intFromHex, slice(a))),
	).buffer as ArrayBuffer
}

/**
 * Convert integer to ArrayBuffer
 */
export const bufferFromNumber = compose(bufferFromHex, zeroPaddedHexFromNumber)
