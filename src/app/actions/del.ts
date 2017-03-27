import * as db from 'idb-keyval'

import { Actions } from '../actions'
import { State } from '../state'

export const del = (key: string) => ({ list }: State, { update }: Actions) =>
	db.del(key).then(() => {
		list.splice(list.findIndex(tile => tile.key === key), 1)
		return update({ list })
	})
