import base32Decode from 'base32-decode'
import * as db from 'idb-keyval'

import { hmac } from './totp'

// if (process.env.NODE_ENV !== 'production') {
const secret = base32Decode('jpa5fglqaw3ki5nn'.toUpperCase(), 'RFC4648')
console.log('demo data')
// db.delete('Test:me').then(() =>
hmac({ secret }).then((secret: CryptoKey) =>
	db.set('Test:me', {
		secret,
		issuer: 'Test',
		account: 'me',
		algorithm: 'SHA-1',
		digits: 6,
		period: 30,
	}),
)
// )
// }
