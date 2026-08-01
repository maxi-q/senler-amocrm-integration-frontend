import { SERVER_URL } from "@/constants";
import axios from "axios";

interface CreateSenlerOAuthSessionParams {
	senlerGroupId: string | number
}

interface CreateSenlerOAuthSessionResponse {
	sessionId: string
	authorizeUrl: string
	expiresAt: string
}

export const createSenlerOAuthSession = async ({
	senlerGroupId,
}: CreateSenlerOAuthSessionParams): Promise<CreateSenlerOAuthSessionResponse | null> => {
	try {
		const response = await axios.post<CreateSenlerOAuthSessionResponse>(
			SERVER_URL + `/oauth/senler/sessions`,
			{ senlerGroupId: +senlerGroupId }
		);

		return response.data;
	} catch (error) {
		console.error("Error creating Senler OAuth session:", error);
		return null;
	}
};

export type SenlerOAuthSessionStatus = 'pending' | 'completed' | 'failed';

export interface SenlerOAuthCallbackResult {
	sessionId: string
	status: SenlerOAuthSessionStatus
	senlerGroupId: number
	nextAuthorizeUrl?: string
	error?: string
}

interface SendSenlerOAuthCallbackParams {
	state: string
	code?: string
	error?: string
}

export const sendSenlerOAuthCallback = async ({
	state,
	code,
	error,
}: SendSenlerOAuthCallbackParams): Promise<SenlerOAuthCallbackResult | null> => {
	try {
		const response = await axios.post<SenlerOAuthCallbackResult>(
			SERVER_URL + `/oauth/senler/callback`,
			{ state, code, error }
		);

		return response.data;
	} catch (err) {
		console.error("Error sending Senler OAuth callback:", err);
		return null;
	}
};
