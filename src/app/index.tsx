import { app } from 'hyperapp'

import { actions, Actions } from './actions'
import { i18n } from './i18n'
import { state, State } from './state'
import { view } from './view'

interface I18nAction extends Actions {
	setI18n: (locale: string) => Promise<Partial<State>>
}

const i18nActions = Object.assign(actions, {
	setI18n: i18n({
		en: () => import('./i18n.en.json'),
		fr: () => import('./i18n.fr.json'),
	}),
})

const { init, tick, setI18n, update } = app<State, I18nAction>(
	state,
	i18nActions,
	view,
	document.body,
)

const fonts = (document as any).fonts
init()
	.then(() => setI18n(navigator.language || 'en').then(update))
	.then(tick)
	.then(() => (fonts ? fonts.ready : Promise.resolve())) // avoid FOUC
	.then(() => {
		document.body.classList.remove('loading')
		setInterval(tick, 1000)
	})
