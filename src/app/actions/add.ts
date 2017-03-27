import * as db from 'idb-keyval'

import { Actions } from '../actions'
import { State } from '../state'
import { TotpAuth } from '../totp/auth'
import { hmac } from '../totp/hmac'

function id({ issuer, account }: TotpAuth) {
	return `${issuer}:${account}`
}

export const add = (otp: TotpAuth) => (_state: State, { init }: Actions) =>
	hmac(otp)
		.then((secret: CryptoKey) => db.set(id(otp), { ...otp, secret }))
		.then(init)
