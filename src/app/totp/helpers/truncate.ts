/**
 * Truncate an ArrayBuffer of 20 bytes array to a n digit integer
 * See https://tools.ietf.org/html/rfc4226#section-5.4
 */

export function truncate(n: number) {
	return function truncate(a: ArrayBuffer) {
		const bytes = new Uint8Array(a)
		const offset = bytes[19] & 0xf
		return (
			(((bytes[offset] & 0x7f) << 24) |
				((bytes[offset + 1] & 0xff) << 16) |
				((bytes[offset + 2] & 0xff) << 8) |
				(bytes[offset + 3] & 0xff)) %
			10 ** n
		)
	}
}
