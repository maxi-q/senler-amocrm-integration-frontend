import { sendAuthCode } from "../../../api/auth/amocrm";

export const sendCode = ({ code, referer, token }: { code: string; referer: string; token: string }) => {
  const url = window.location.href
  const params = new URLSearchParams(new URL(url).search)
  const groupId = params.get('group_id') || ''

  sendAuthCode({
    senlerAccessToken: token,
    senlerGroupId: groupId,
    amoCrmDomain: referer,
    amoCrmAuthorizationCode: code
  })
}