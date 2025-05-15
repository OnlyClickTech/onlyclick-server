import makeLog from "./logentries.js";
class ApiError extends Error{
    constructor(statusCode , message){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.stack = new Error().stack;
        makeLog(message , "ApiError" , process.env.errorLogs);
    }

    static badRequest(message){
        return new ApiError(400 , message);
    }
}

module.exports = ApiError;