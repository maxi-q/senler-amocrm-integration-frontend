import { useEffect, useState } from 'react'

export const getUrlParams = () => {
  const url = window.location.href;
  const params = new URLSearchParams(new URL(url).search);

  return {
    sign: params.get('sign') || '',
    senlerGroupId: params.get('group_id') || '',
    senlerUserId: params.get('user_id') || '',
    context: params.get('context') || '',
    senlerChannelTypeId: params.get('channel_type_id') || '',
  };
};

type Procedure = (...args: any[]) => void

export const useDebounceCallback = <F extends Procedure>(
	func: F,
	delay: number
): ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) => {
	const [args, setArgs] = useState<any[] | null>(null)
	useEffect(() => {
		if (args === null) return
		const timeout = setTimeout(() => func(...args), delay)
		return () => clearTimeout(timeout)
	}, [args]) // DO NOT add func and delay to deps
	return (...newArgs: any[]) => setArgs(newArgs)
}