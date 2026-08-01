interface NavigatorWithUserAgentData extends Navigator {
	userAgentData?: { mobile?: boolean }
}

/**
 * Popup-окна на мобильных браузерах ненадёжны (открываются новой вкладкой,
 * `window.opener` часто недоступен). Поэтому для мобильных устройств авторизация amoCRM
 * идёт через full-page переход, а не через `window.open`.
 */
export const isMobileDevice = (): boolean => {
	const nav = navigator as NavigatorWithUserAgentData

	if (nav.userAgentData?.mobile === true) {
		return true
	}

	if (/Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent)) {
		return true
	}

	// Некоторые встроенные браузеры и webview передают desktop User-Agent.
	// Coarse pointer + touch + небольшой экран покрывают этот случай.
	return (
		nav.maxTouchPoints > 0 &&
		window.matchMedia?.('(pointer: coarse)').matches === true &&
		Math.min(window.screen.width, window.screen.height) <= 1024
	)
}
