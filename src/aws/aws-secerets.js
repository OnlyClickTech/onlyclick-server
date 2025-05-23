
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "onlyclick-server";

const client = new SecretsManagerClient({
  region: "ap-south-1",
});

let response;

try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
    })
  );
  var secret = response.SecretString;
} catch (error) {
  throw error;
}
console.log(secret);
secret = JSON.parse(secret);
console.log(secret);
export default secret;