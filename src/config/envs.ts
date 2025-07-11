function validateEnvs(envs: Record<string, string | undefined>) {
  const missingEnvs = Object.entries(envs)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingEnvs.length) {
    throw new Error(`Missing environment variables: ${missingEnvs.join(', ')}`);
  }
}

function getEnvs() {
  const envs = {
    baseUrlApi: process.env.NEXT_PUBLIC_BASE_URL_API!,
    mccUrlApi: process.env.NEXT_MCC_PUBLIC_BASE_URL_API!,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
    clientIdAD: process.env.NEXT_PUBLIC_CLIENT_ID_AD!,
    authorityAD: process.env.NEXT_PUBLIC_AUTHORITY_AD!,
    secretKey: process.env.NEXT_PUBLIC_SECRET_KEY!,
    X_API_KEY: process.env.NEXT_PUBLIC_X_API_KEY!,
  };


  // validateEnvs(envs);

  return envs;
}

const envs = getEnvs();

export default envs;

