interface InstallEvent extends Event {
	userChoice: Promise<UserChoice>
}

interface UserChoice {
	outcome: string
}

window.addEventListener('beforeinstallprompt', (event: InstallEvent) => {
	// https://developers.google.com/web/fundamentals/getting-started/primers/promises
	event.userChoice.then(({ outcome }) =>
		console.log(
			outcome,
			outcome === 'dismissed'
				? 'User cancelled home screen install'
				: 'User added to home screen',
		),
	)
})
