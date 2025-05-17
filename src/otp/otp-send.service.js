import twilio from "twilio";
import dotenv from "dotenv";
import createService from "./otp.service.js";
dotenv.config({path: "../../.env"});

var createOtpService = " ";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
var serviceId = process.env.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken);

async function createVerification(phoneNumber) {
  if(createOtpService){
    const verification = await client.verify.v2
      .services("VA703956fc9e53c334936a47c5018a7b9f")
      .verifications.create({
        channel: "sms",
        to: `${phoneNumber}`,
      });
    return verification;
  }
}

export default createVerification;