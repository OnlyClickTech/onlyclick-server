function startOtpGeneration(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

function endOtpGeneration(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

export { startOtpGeneration, endOtpGeneration };