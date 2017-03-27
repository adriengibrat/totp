import { QRParams } from '../qr'
import { State } from '../state'
import { TotpAuth } from '../totp/auth'
import { add } from './add'
import { create } from './create'
import { del } from './del'
import { init } from './init'
import { scan } from './scan'
import { swipe, SwipeParams } from './swipe'
import { tick } from './tick'
import { update } from './update'

export interface Actions {
	add(otp: TotpAuth): Promise<State>
	create(element: HTMLElement): State
	del(key: string): Promise<State>
	init(): Promise<State>
	scan(settings: QRParams): Promise<State>
	swipe(params: SwipeParams): State
	tick(): Promise<State>
	update(partial: Partial<State>): State
}

export const actions = {
	add,
	create,
	del,
	init,
	scan,
	swipe,
	tick,
	update,
}
