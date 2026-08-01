const SERVER_OAUTH_STATE_PREFIX = 'mobile_'

/**
 * Callback должен продолжать серверный OAuth-флоу только для state,
 * который был создан backend. Повторная проверка устройства ненадёжна:
 * iframe и callback-страница могут получить разные User-Agent/кэш приложения.
 */
export const isServerOAuthState = (state: string): boolean =>
	state.startsWith(SERVER_OAUTH_STATE_PREFIX)
