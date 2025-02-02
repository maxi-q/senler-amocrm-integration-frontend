import { sendAuthCode } from "../../../../../api/Backend/auth";

export const sendCode = ({ code, referer, token }: { code: string; referer: string; token: string }) => {
  const url = window.location.href
  const params = new URLSearchParams(new URL(url).search)
  const groupId = params.get('group_id') || ''
  const sign = params.get('sign') || ''

  sendAuthCode({
    senlerAccessToken: token,
    senlerGroupId: groupId,
    amoCrmDomain: referer,
    amoCrmAuthorizationCode: code,
    senlerSign: sign
  })
}