import cc from 'classcat'
import { h } from 'hyperapp'

import logo from '../../assets/logo/vector.svg'
import { Actions } from '../actions'
import { List } from '../components/tile-list'
import { State } from '../state'
import style from './view.scss'

export const view = (state: State, { create, scan }: Actions) => (
	<div class={style.app} oncreate={create}>
		<header class={style.header}>
			<img class={style.logo} src={logo} alt={state.messages.appLogoAlt} />
			<div class={style.title}>
				<h1>{state.messages.appTitle}</h1>
				<small>{state.messages.appBaseline}</small>
			</div>
		</header>
		{state.list.length ? (
			<List list={state.list} />
		) : (
			<h2 class={style.welcome}>{state.messages.appWelcome}</h2>
		)}
		<canvas
			class={cc({
				[style.scan]: true,
				[style.scanning]: state.scanning,
			})}
		/>
		{state.scanning ? (
			<button
				class={style.add}
				onclick={() => state.stopScanning()}
				title={state.messages.stopScanButton}
			>
				&times;
			</button>
		) : (
			<button
				class={style.add}
				onclick={() => scan({ canvas: state.preview })}
				title={state.messages.scanButton}
			>
				+
			</button>
		)}
	</div>
)
