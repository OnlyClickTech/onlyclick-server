import twilio from "twilio";
import dotenv from "dotenv";
import createService from "./otp.service.js";
import secret from "../aws/aws-secerets.js";
dotenv.config({path: "../../.env"});

var createOtpService = " ";
const accountSid = secret.TWILIO_ACCOUNT_SID;
const authToken = secret.TWILIO_AUTH_TOKEN;
var serviceId = secret.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken);

async function createVerification(phoneNumber) {
  if(createOtpService){
    const verification = await client.verify.v2
      .services(secret.TWILIO_SERVICE_SID)
      .verifications.create({
        channel: "sms",
        to: `${phoneNumber}`,
      });
    return verification;
  }
}

export default createVerification;