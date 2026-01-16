// src/lib/docusign/client.ts
import docusign from 'docusign-esign';

const jwtLifeSec = 10 * 60;
const scopes = ['signature', 'impersonation'];

let cachedAccessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < tokenExpiry) {
    return cachedAccessToken;
  }

  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(process.env.DOCUSIGN_OAUTH_BASE_PATH!);

  const privateKeyBytes = Buffer.from(
    process.env.DOCUSIGN_PRIVATE_KEY!.replace(/\\n/g, '\n')
  );

  const results = await apiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY!,
    process.env.DOCUSIGN_USER_ID!,
    scopes,
    privateKeyBytes,
    jwtLifeSec
  );

  cachedAccessToken = results.body.access_token;
  tokenExpiry = Date.now() + (results.body.expires_in * 1000) - 60000;

  return cachedAccessToken;
}

export async function getDocuSignClient(): Promise<docusign.ApiClient> {
  const accessToken = await getAccessToken();
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!);
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
  return apiClient;
}