export const crypto: Crypto =
	window.crypto || (window as any).msCrypto || (window as any).webitCrypto

/**
 * Hash allowed for HMAC SHA algorithm
 */
export type HmacSha = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

/**
 * Key params
 */
const NOT_EXTRACTABLE = false
const SIGN_ONLY = ['sign']

/**
 * Get HMAC SHA algorithm params from SHA hash name
 */
function hmacSha(algorithm: HmacSha): HmacImportParams {
	return {
		name: 'HMAC',
		hash: { name: algorithm },
	}
}

/**
 * Generate crypto key of given secret using HMAC SHA algorithm
 */
export function hmac({
	secret,
	algorithm = 'SHA-1',
}: {
	secret: ArrayBuffer
	algorithm?: HmacSha
}) {
	return crypto.subtle.importKey(
		'raw',
		secret,
		hmacSha(algorithm),
		NOT_EXTRACTABLE,
		SIGN_ONLY,
	) as Promise<CryptoKey>
}
