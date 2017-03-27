import { compose, pad } from './helpers/utils'
import { bufferFromNumber } from './helpers/convert'
import { luhn } from './helpers/luhn'
import { truncate } from './helpers/truncate'
import { time, countdown } from './helpers/time'

import { crypto } from './hmac'

/**
 * Append luhn checksum to given number
 */
function appendChecksum(n: number) {
	return n * 10 + luhn(n)
}

interface OtpOptions {
	secret: CryptoKey
	digits?: number
	checksum?: boolean
}

export interface TotpOptions extends OtpOptions {
	period?: number
}

export interface TotpResult {
	code: string
	timer: number
}

type TotpFactory = (timestamp?: number) => Promise<TotpResult>

/**
 * Generate time based one time password from opaque secret key
 */
export function totp({
	secret,
	digits = 6,
	checksum = false,
	period = 30,
}: TotpOptions): TotpFactory {
	const factor = compose(bufferFromNumber, time(period))
	const format = compose(
		pad(0, digits),
		checksum ? compose(appendChecksum, truncate(digits - 1)) : truncate(digits),
	)
	const remain = countdown(period)
	const otp = (timestamp = Date.now()) =>
		crypto.subtle
			.sign('HMAC', secret, factor(timestamp))
			.then(format) as Promise<string>
	let _code: string
	return (timestamp = Date.now()): Promise<TotpResult> => {
		const timer = remain(timestamp)
		return !_code || timer === period
			? otp().then((code: string) => ({ code: (_code = code), timer }))
			: Promise.resolve({ code: _code, timer })
	}
}

export interface HotpOptions extends OtpOptions {
	counter: number
}

type HotpFactory = (count?: number) => Promise<string>

/**
 * Generate event based one time password from opaque secret key
 */
export function hotp({
	secret,
	counter,
	digits = 6,
	checksum = false,
}: HotpOptions): HotpFactory {
	const format = compose(
		pad(0, digits),
		checksum ? compose(appendChecksum, truncate(digits - 1)) : truncate(digits),
	)
	return (count: number = counter++): Promise<string> =>
		crypto.subtle
			.sign('HMAC', secret, bufferFromNumber(count))
			.then(format) as Promise<string>
}
