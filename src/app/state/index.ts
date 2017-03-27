import { TileParams } from '../components/tile'

export type State = typeof state

export const state = {
	preview: undefined as undefined | HTMLCanvasElement,
	scanning: false,
	list: [] as TileParams[],
	stopScanning() {
		/* noop */
	},
	locale: '',
	messages: {} as any,
}
