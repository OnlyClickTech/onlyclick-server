/*
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "ap-southeast-1" });

async function getSecret(secretName) {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await client.send(command);
    if (data.SecretString) return JSON.parse(data.SecretString);
    else return JSON.parse(Buffer.from(data.SecretBinary, "base64").toString("ascii"));
  } catch (error) {
    console.error("Error fetching secret:", error);
    throw error;
  }
}

export default getSecret;
*/
