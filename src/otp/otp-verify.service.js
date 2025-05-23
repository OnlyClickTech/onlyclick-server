import twilio from "twilio";
import dotenv from "dotenv";
import secret from "../aws/aws-secerets.js";
dotenv.config({ path: "../../.env" });

const accountSid = secret.TWILIO_ACCOUNT_SID;
const authToken = secret.TWILIO_AUTH_TOKEN;
const serviceId = secret.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken);

async function createVerificationCheck(phoneNumber, otp) {
  if (!otp || !phoneNumber) {
    throw new Error("OTP and phone number are required.");
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(serviceId)
      .verificationChecks.create({
        code: otp,
        to: phoneNumber,
      });
    console.log("Verification Check Response:", verificationCheck.status);
    if (verificationCheck.status === "approved") {
      return {
        status: "approved",
        message: "OTP verified successfully.",
      };
    }

    return {
      status: verificationCheck.status,
      message: "OTP verification status: " + verificationCheck.status,
    };
  } catch (error) {
    if (error.code === 20404) {
      return {
        status: "not_found",
        message: "OTP session not found or already expired.",
      };
    }

    console.error("Error verifying OTP:", error.message);
    throw new Error("Failed to verify OTP. Please try again.");
  }
}

export default createVerificationCheck;
