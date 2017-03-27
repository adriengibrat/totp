import { State } from '../state'

export const update = (partial: Partial<State>) => (state: State): State => ({
	...state,
	...partial,
})
