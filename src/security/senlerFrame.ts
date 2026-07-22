const SENLER_DOMAIN = (import.meta.env.VITE_SENLER_DOMAIN ?? '').trim().toLowerCase()

export const isAllowedSenlerOrigin = (origin: string) => {
	try {
		if (!SENLER_DOMAIN) return false

		const { hostname, protocol } = new URL(origin)

		return protocol === 'https:' && (hostname === SENLER_DOMAIN || hostname.endsWith(`.${SENLER_DOMAIN}`))
	} catch {
		return false
	}
}

export const getDefaultSenlerOrigin = () => `https://${SENLER_DOMAIN}`

export const isOpenedInAllowedSenlerFrame = () => {
	if (!SENLER_DOMAIN) {
		console.warn('VITE_SENLER_DOMAIN is not set — iframe protection is disabled')
		return true
	}

	try {
		if (window.self === window.top) return false

		const ancestorOrigins = (window.location as Location & { ancestorOrigins?: DOMStringList }).ancestorOrigins

		if (!ancestorOrigins || ancestorOrigins.length === 0) return true

		return Array.from(ancestorOrigins).some(isAllowedSenlerOrigin)
	} catch {
		return true
	}
}
