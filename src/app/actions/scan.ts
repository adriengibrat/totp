import { Actions } from '../actions'
import { QRParams } from '../qr'
import { State } from '../state'

export interface ScanAction {
	(settings: QRParams): Promise<State>
}

export const scan = (settings: QRParams) => (
	_state: State,
	{ add, update, init }: Actions,
) => {
	const scanning = (scanning: boolean) => update({ scanning })
	scanning(true)
	return import('../qr') // see qr split bundle in fuse.js
		.then(({ QR }) => {
			const scan = QR({
				...settings,
				callback: (error: string) => console.error(error),
			})
			update({
				stopScanning: () => {
					scan.stop()
					scanning(false)
				},
			})
			return scan
		})
		.then(add)
		.then(init)
		.then(
			() => scanning(false),
			(error: Error) => {
				scanning(false)
				throw error
			},
		)
}
