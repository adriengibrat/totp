import { Actions } from '../actions'
import { TileParams } from '../components/tile'
import { State } from '../state'
import { TotpResult } from '../totp'

export const tick = () => ({ list }: State, { update }: Actions) =>
	Promise.all(
		list.map(tile =>
			tile.otp().then(
				({ code, timer }: TotpResult): TileParams => ({
					...tile,
					code,
					timer,
				}),
			),
		),
	)
		.then(list => update({ list }))
		.catch(console.error)
