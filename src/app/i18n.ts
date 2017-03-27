export const i18n = (loader: { [locale: string]: () => Promise<{}> }) => {
	const locales = Object.keys(loader)
	return (locale: string) => {
		const load = loader[~locales.indexOf(locale) ? locale : locales[0]]
		return load().then(messages => ({ locale, messages }))
	}
}
