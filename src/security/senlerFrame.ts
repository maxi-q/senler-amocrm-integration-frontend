const DEFAULT_SENLER_ORIGIN = 'https://senler.ru'

export const isAllowedSenlerOrigin = (origin: string) => {
	try {
		const { hostname, protocol } = new URL(origin)

		return protocol === 'https:' && (hostname === 'senler.ru' || hostname.endsWith('.senler.ru'))
	} catch {
		return false
	}
}

export const getDefaultSenlerOrigin = () => DEFAULT_SENLER_ORIGIN

export const isOpenedInAllowedSenlerFrame = () => {
	try {
		if (window.self === window.top) return false

		const ancestorOrigins = (window.location as Location & { ancestorOrigins?: DOMStringList }).ancestorOrigins

		if (!ancestorOrigins || ancestorOrigins.length === 0) return true

		return Array.from(ancestorOrigins).some(isAllowedSenlerOrigin)
	} catch {
		return true
	}
}
