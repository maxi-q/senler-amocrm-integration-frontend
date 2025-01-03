import { sendAuthCode } from "../../../api/auth/amosrm";

export const sendCode = ({ code, referer, token }: { code: string; referer: string; token: string }) => {
  const url = window.location.href
  const params = new URLSearchParams(new URL(url).search)
  const groupId = params.get('group_id') || ''

  sendAuthCode({
    senlerAccessToken: token,
    senlerVkGroupId: groupId,
    amoCrmDomain: referer,
    amoCrmAuthorizationCode: code
  })
}