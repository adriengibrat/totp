const MS_PER_SECOND = 1000

/**
 * Convert milliseconds to seconds
 */
export function seconds(milliseconds: number) {
	return Math.floor(milliseconds / MS_PER_SECOND)
}

/**
 * Convert seconds to milliseconds
 */
export function milliseconds(seconds: number) {
	return seconds * MS_PER_SECOND
}

/**
 * Count remaining seconds until next period of n seconds for given timestamp
 * by default n is 30 and timestamp is now
 */
export function countdown(n = 30) {
	return (timestamp = Date.now()) => n - seconds(timestamp) % n
}

/**
 * Count periods of n seconds for given timestamp
 * by default n is 30 and timestamp is now
 */
export function time(n = 30) {
	return (timestamp = Date.now()) => Math.floor(seconds(timestamp) / n)
}
