import { State } from '../state'

export interface SwipeParams {
	key: string
	removing: boolean
}

export const swipe = ({ key, removing }: SwipeParams) => ({ list }: State) => {
	const index = list.findIndex(tile => tile.key === key)
	list.splice(index, 1, { ...list[index], removing })
	return { list: list.slice() }
}
