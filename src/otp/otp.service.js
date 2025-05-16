import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config({path: "../../.env"});
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createService() {
  const service = await client.verify.v2.services.create({
    friendlyName: "My First Verify Service",
  });
  console.log(`Service SID: ${service.sid}`);
}


export default createService;