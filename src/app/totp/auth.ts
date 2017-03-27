import base32Decode from 'base32-decode'
import base32Encode from 'base32-encode'

import { compose } from './helpers/utils'
import { HmacSha } from './hmac'

interface OtpAuth {
	secret: ArrayBuffer
	account: string
	issuer?: string
	algorithm?: HmacSha
	digits?: number
	// custom params
	color?: string
	image?: string
	endpoint?: string
}

export interface TotpAuth extends OtpAuth {
	type: 'totp'
	period?: number
}

export interface HotpAuth extends OtpAuth {
	type: 'hotp'
	counter: number
}

const DEFAULTS = {
	issuer: '',
	algorithm: 'SHA-1' as HmacSha,
	digits: 6,
	period: 30,
	counter: 0,
}

/**
 * Parse otpauth URI (totp or hotp)
 */
export function otpAuth(url: string): TotpAuth | HotpAuth {
	// parse via Regexp because mobile lacks of URL & SearchParams support
	const parser = /^otpauth:\/\/([th]otp)\/(?:([^:]+):)?([^\/]+)\/?\?(.*)$/
	const parsed = parser.exec(url)
	if (!parsed) {
		throw new Error(
			`Unable to parse "${url}", Does not seems to be a valid otpauth URI`,
		)
	}
	const [, type, pathIssuer, account, query] = parsed
	const {
		secret,
		issuer,
		algorithm,
		digits,
		counter,
		period,
		color,
		image,
		endpoint,
	} = parse(query)
	const otp = {
		type,
		account,
		secret: bufferFromBase32(secret),
		issuer: issuer || pathIssuer || DEFAULTS.issuer, // issuer *may be* in path or query
		algorithm: algorithm || DEFAULTS.algorithm, // issuer *may be* in query
		digits: digits || DEFAULTS.digits, // issuer *may be* in query
		// custom params
		color,
		image,
		endpoint,
	}
	return type === 'totp'
		? ({
				...otp,
				period: period || DEFAULTS.period,
			} as TotpAuth)
		: ({
				...otp,
				counter: counter || DEFAULTS.counter,
			} as HotpAuth)
}

/**
 * Create otpauth URI (totp or hotp)
 * see https://github.com/google/google-authenticator/wiki/Key-Uri-Format
 */
export function otpURI(params: TotpAuth | HotpAuth) {
	const {
		type,
		secret,
		account,
		issuer = DEFAULTS.issuer,
		algorithm = DEFAULTS.algorithm,
		digits = DEFAULTS.digits,
		color,
		image,
		endpoint,
	} = params
	return `otpauth://${type}/${path(account, issuer)}?${query(
		Object.assign(
			{
				secret: base32Encode(secret, 'RFC4648') as string,
				issuer,
				algorithm,
				digits,
				color,
				image,
				endpoint,
			},
			'totp' === type
				? {
						period: (params as TotpAuth).period || DEFAULTS.period,
					}
				: {
						counter: (params as HotpAuth).counter || DEFAULTS.counter,
					},
		),
	)}`
}

function clean(a: string) {
	return a.replace(/[-_.\s]/g, '').toUpperCase()
}

const bufferFromBase32 = compose(
	(a: string) => base32Decode(a, 'RFC4648') as ArrayBuffer,
	clean,
)

function URIencode(a: string) {
	return encodeURIComponent(a)
} // helps minification

function URIdecode(a: string) {
	return decodeURIComponent(a)
} // helps minification

function parse(query: string) {
	return query.split('&').reduce(parseParams, {} as OtpParams)
}

function path(account: string, issuer?: string) {
	return issuer
		? `${URIencode(issuer)}:${URIencode(account)}`
		: URIencode(account)
}

type OtpParams = {
	secret: string
	account?: string
	issuer?: string
	algorithm?: HmacSha
	digits?: number
	counter?: number
	period?: number
	// custom params
	color?: string
	image?: string
	endpoint?: string
}

function append(params: OtpParams) {
	return function _append(pairs: string[], key: keyof OtpParams) {
		const value = params[key]
		if (value !== undefined) {
			return pairs.concat(`${URIencode(key)}=${URIencode(value.toString())}`)
		}
		return pairs
	}
}

function query(params: OtpParams, glue = '&') {
	return Object.keys(params)
		.reduce(append(params), [])
		.join(glue)
}

function parseParams(params: OtpParams, param: string) {
	const index = param.indexOf('=')
	params[URIdecode(param.slice(0, index)) as keyof OtpParams] = URIdecode(
		param.slice(index + 1),
	)
	return params
}
