function generateUniqueUserId() {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomNum = Math.floor(Math.random() * 100000); // Random number between 0 and 99999
  const uniqueUserId = `${timestamp}${randomNum}`;
  return uniqueUserId;
}

export default generateUniqueUserId;