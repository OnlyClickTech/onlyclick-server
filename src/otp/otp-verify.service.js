import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_SID;
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

    // Check if the OTP is already verified
    if (verificationCheck.status === "approved") {
      return {
        status: "already_verified",
        message: "The OTP has already been verified.",
      };
    }

    return verificationCheck;
  } catch (error) {
    if (error.message.includes("The requested resource")) {
      return {
        status: "already_verified",
        message: "The OTP has already been verified.",
      };
    }

    console.error("Error verifying OTP:", error.message);
    throw new Error("Failed to verify OTP. Please try again.");
  }
}

export default createVerificationCheck;