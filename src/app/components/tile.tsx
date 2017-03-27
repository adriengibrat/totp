import 'tocca'

import { State } from 'app/state'
import cc from 'classcat'
import { h } from 'hyperapp'

import { Actions } from '../actions'
import { TotpResult } from '../totp'
import style from './tile.scss'

export interface TileParams {
	key: string
	issuer: string
	account: string
	code: string
	timer: number
	otp: () => Promise<TotpResult>
	removing: boolean
}

export const Tile = ({
	key,
	issuer,
	account,
	code,
	timer,
	removing,
}: TileParams) => (state: State, { swipe, del }: Actions) => (
	<section
		key={key}
		onswipeleft={() => swipe({ key, removing: true })}
		class={cc({
			[style.tile]: true,
			[style.removing]: removing,
		})}
	>
		<aside
			onswiperight={() => swipe({ key, removing: false })}
			class={style.confirm}
		>
			<p>
				{state.messages.delWarn}
				<small class={style.message}>{state.messages.delMessage}</small>
			</p>
			<a
				class={style.cancel}
				onclick={(event: Event) => {
					swipe({ key, removing: false })
					event.stopPropagation()
				}}
			>
				{state.messages.delCancel}
			</a>
			<a
				class={style.remove}
				onclick={() => del(key)}
				title={state.messages.delTitle}
			>
				⊗
			</a>
		</aside>
		<article class={style.view}>
			<h2>
				{issuer} {account}
			</h2>
			<span
				class={style.timer}
				data-value={Math.round(101 - (timer * 100) / 30)}
			/>
			<strong>{code.replace(/(.{3})/g, '$1 ')}</strong>
		</article>
	</section>
)
