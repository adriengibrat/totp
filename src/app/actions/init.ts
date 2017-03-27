import * as db from 'idb-keyval'

import { Actions } from '../actions'
import { TileParams } from '../components/tile'
import { State } from '../state'
import { totp, TotpOptions } from '../totp/otp'

interface TotpRecord extends TotpOptions {
	issuer: string
	account: string
}

function id({ issuer, account }: TotpRecord) {
	return `${issuer}:${account}`
}

function tile(
	{ del, swipe }: Partial<Actions>,
	record: TotpRecord,
): TileParams {
	const { issuer, account } = record
	const key = id(record) // TODO: record should contain key
	return {
		key,
		issuer,
		account,
		code: '------',
		timer: 30,
		otp: totp(record),
		confirm: swipe as Actions['swipe'],
		removing: false,
		remove: del as Actions['del'],
	}
}

export const init = () => (_state: State, { update, del, swipe }: Actions) =>
	db
		.keys()
		.then(keys => keys.map(key => db.get<TotpRecord>(key)))
		.then(list => Promise.all(list))
		.then(list => list.map(params => tile({ del, swipe }, params)))
		.then(list => update({ list }))
// .catch(console.error)
