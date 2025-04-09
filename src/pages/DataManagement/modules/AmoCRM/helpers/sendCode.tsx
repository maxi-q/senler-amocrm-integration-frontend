import { getUrlParams } from "@/helpers";
import { sendAuthCode } from "@/api/Backend/auth";

export const sendCode = async ({ code, referer, token }: { code: string; referer: string; token: string }) => {
  const { sign, senlerGroupId } = getUrlParams()

  const successRegistration = await sendAuthCode({
    senlerAccessToken: token,
    senlerGroupId,
    amoCrmDomain: referer,
    amoCrmAuthorizationCode: code,
    senlerSign: sign,
  })

  return successRegistration.ok
}