function generateUniqueBookingId(){
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
    return `${year}${month}${day}${randomNum.toString().padStart(4, '0')}`; // Format: YYMMDDXXXX
}

export default generateUniqueBookingId;