/**
 * Luhn numbers
 */
const luhns = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
/**
 * Compute Luhn checksum
 */
export function luhn(n: number) {
	const digits = n.toString()
	let length = digits.length
	let bit = 1
	let sum = 0
	while (length) {
		const digit = ~~digits.charAt(--length)
		const num = (bit ^= 1)
		sum += num ? luhns[digit] : digit
	}
	return sum % 10
}
