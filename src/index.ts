import './app/index'
import './app/install'

// import './app/demo-data'

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js')
}
