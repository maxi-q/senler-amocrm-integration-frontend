import { getUrlParams } from "@/helpers";
import { sendAuthCode } from "@/api/Backend/auth";

export const sendCode = async ({ code, referer, OAuthCode }: { code: string; referer: string; OAuthCode: string; }) => {
  const { sign, senlerGroupId } = getUrlParams()

  const successRegistration = await sendAuthCode({
    senlerAuthorizationCode: OAuthCode,
    senlerGroupId,
    amoCrmDomain: referer,
    amoCrmAuthorizationCode: code,
    senlerSign: sign,
  })

  return successRegistration.ok
}