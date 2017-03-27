import jsQR from 'jsqr'

import { otpAuth, TotpAuth } from './totp/auth'

function _draw(context: CanvasRenderingContext2D, location: QRPosition) {
	const {
		bottomLeftFinderPattern: { x: xbl, y: ybl },
		topLeftFinderPattern: { x: xtl, y: ytl },
		topRightFinderPattern: { x: xtr, y: ytr },
	} = location
	context.beginPath()
	context.moveTo(xbl, ybl)
	context.lineTo(xtl, ytl)
	context.lineTo(xtr, ytr)
	context.lineWidth = 2
	context.strokeStyle = 'green'
	context.stroke()
}

function _decode(data: string, resolve: Function, callback?: Function) {
	try {
		resolve(otpAuth(data))
	} catch (error) {
		callback && callback(error)
	}
}

interface QRPosition {
	bottomLeftFinderPattern: { x: number; y: number }
	topLeftFinderPattern: { x: number; y: number }
	topRightFinderPattern: { x: number; y: number }
}

export interface QRParams {
	canvas?: HTMLCanvasElement
	timeout?: number
	callback?: Function
}

export interface AuthPromise extends Promise<TotpAuth> {
	stop: () => void
}

export function QR({
	canvas = document.createElement('canvas'),
	timeout = 60000,
	callback,
}: QRParams): AuthPromise {
	let stop = () => {
		/* noop */
	}
	const authPromise = (navigator as Navigator).mediaDevices
		.getUserMedia({
			audio: false,
			video: { facingMode: 'environment' },
		})
		.then(media => {
			const video = document.createElement('video')
			const width = (canvas.width = 640)
			const height = (canvas.height = 480)
			const context = canvas.getContext('2d') as CanvasRenderingContext2D
			let to: number
			let raf: number
			function clean() {
				media.getVideoTracks().forEach(track => track.stop())
				context.clearRect(0, 0, width, height)
				video.pause()
				delete video.srcObject
				clearTimeout(to)
				cancelAnimationFrame(raf)
			}
			const found = new Promise<TotpAuth>((resolve, reject) => {
				stop = () => {
					clean()
					reject(Error('Stopped'))
				}
				to = setTimeout(reject.bind(null, Error('Timeout')), timeout)
				const unresolved = {}
				function tick() {
					context.drawImage(video, 0, 0, width, height)
					const { data } = context.getImageData(0, 0, width, height)
					const frame = jsQR(data, width, height)
					if (frame) {
						const { location, data } = frame
						location && _draw(context, location)
						data && _decode(data, resolve, callback)
					}
					Promise.race([found, unresolved]).then(
						state =>
							state === unresolved && (raf = requestAnimationFrame(tick)),
					)
				}
				video.srcObject = media
				video.onplaying = tick
				video.play()
			})

			return found.then(
				// home made Promise.finaly(clean)
				result => {
					clean()
					return result
				},
				error => {
					clean()
					throw error
				},
			)
		}) as AuthPromise
	authPromise.stop = stop
	return authPromise
}
