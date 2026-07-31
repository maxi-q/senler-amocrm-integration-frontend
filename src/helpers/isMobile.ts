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

	if (typeof nav.userAgentData?.mobile === 'boolean') {
		return nav.userAgentData.mobile
	}

	return /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent)
}
