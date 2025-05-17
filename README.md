# OnlyClick Server

A Node.js/Express.js backend service for a home services marketplace platform. This server handles service bookings, user management, and various home service categories like electrical work, plumbing, cleaning, etc.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Logging System](#logging-system)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Node.js (v23.11.0 or higher)
- MongoDB
- Docker (optional, for containerized deployment)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd onlyclick-server
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_SERVICE_SID=your_twilio_service_sid
enableLogging=true
serverLogs=./logs/server.log
errorLogs=./logs/error.log
```

> **Note:** Replace placeholders with your actual credentials.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Docker Setup

1. Build the Docker image:
    ```bash
    docker build -t onlyclick-server .
    ```

2. Run the container:
    ```bash
    docker run -p 8000:8000 --env-file .env onlyclick-server
    ```

Or use Docker Compose:
```bash
docker-compose up
```

## Project Structure

```
onlyclick-server/
├── index.js                  # Main application entry point
├── src/
│   ├── aws/
│   │   └── aws-secerets.js   # AWS Secrets Manager integration
│   ├── controllers/
│   │   ├── auth.controller.js # Handles OTP and user authentication
│   │   └── user.controller.js # Handles user management
│   ├── database/
│   │   └── catalog.js        # Database connection setup
│   ├── middlewares/
│   │   └── auth.middleware.js # JWT authentication middleware
│   ├── models/
│   │   ├── address.model.js  # Address schema
│   │   └── users.model.js    # User schema with JWT token generation
│   ├── otp/
│   │   ├── otp-send.service.js # Sends OTP using Twilio
│   │   ├── otp-verify.service.js # Verifies OTP using Twilio
│   │   └── otp.service.js    # Twilio service creation
│   ├── routes/
│   │   ├── auth.routes.js    # Authentication routes
│   │   └── user.routes.js    # User management routes
│   ├── utils/
│   │   ├── ApiError.js       # Custom error handling
│   │   ├── ApiResponse.js    # Standardized API responses
│   │   ├── asyncHandler.js   # Async error handling middleware
│   │   ├── constants.js      # Application constants
│   │   ├── logentries.js     # Logging utility
│   │   └── userIdGeneration.js # Generates unique user IDs
├── dockerfile                # Docker configuration
├── compose.yaml              # Docker Compose configuration
└── package.json              # Project dependencies
```

## Key Components

### 1. Main Application ([`index.js`](index.js))
- Sets up Express server, middleware (CORS, JSON parsing, cookies).
- Connects to MongoDB using [`src/database/catalog.js`](src/database/catalog.js).
- Loads secrets from AWS if configured.
- Root endpoint: `GET /` returns server status.

### 2. User Authentication
- **OTP Sending ([`src/otp/otp-send.service.js`](src/otp/otp-send.service.js))**:
  - Sends OTP to the user's phone number using Twilio.
- **OTP Verification ([`src/otp/otp-verify.service.js`](src/otp/otp-verify.service.js))**:
  - Verifies the OTP and checks if it has already been verified.
- **JWT Token Generation ([`src/models/users.model.js`](src/models/users.model.js))**:
  - Generates access and refresh tokens for authenticated users.

### 3. User Management
- **Update User ([`src/controllers/user.controller.js`](src/controllers/user.controller.js))**:
  - Updates user details like name and phone number.
- **Update User Address ([`src/controllers/user.controller.js`](src/controllers/user.controller.js))**:
  - Updates the user's address.
- **Get User ([`src/controllers/user.controller.js`](src/controllers/user.controller.js))**:
  - Fetches user details based on the authenticated user's ID.

### 4. Utility Functions
- **API Response Handler** ([`src/utils/ApiResponse.js`](src/utils/ApiResponse.js)): Standardized API response format.
- **Error Handler** ([`src/utils/ApiError.js`](src/utils/ApiError.js)): Custom error class, logs errors.
- **Async Handler** ([`src/utils/asyncHandler.js`](src/utils/asyncHandler.js)): Async route handler wrapper.
- **Constants** ([`src/utils/constants.js`](src/utils/constants.js)): User roles, service categories, subcategories, status enums, OTP event types.
- **Logging System** ([`src/utils/logentries.js`](src/utils/logentries.js)): Timestamped logging (IST), file or console output.
- **Unique User ID Generator** ([`src/utils/userIdGeneration.js`](src/utils/userIdGeneration.js)): Generates unique user IDs.

## API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Authentication Routes
- **Send OTP**:
  - `POST /api/auth/send-otp`
  - Request Body:
    ```json
    {
      "phoneNumber": "+1234567890"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 200,
      "message": "OTP sent successfully"
    }
    ```

- **Verify OTP**:
  - `POST /api/auth/verify-otp`
  - Request Body:
    ```json
    {
      "phoneNumber": "+1234567890",
      "code": "123456"
    }
    ```
  - Response (Success):
    ```json
    {
      "statusCode": 200,
      "message": "Logged in successfully",
      "data": {
        "accessToken": "your_access_token",
        "refreshToken": "your_refresh_token",
        "user": { ... }
      }
    }
    ```

#### User Routes
- **Get User**:
  - `GET /api/user/get-user`
  - Requires `Authorization` header with a valid JWT token.
  - Response:
    ```json
    {
      "statusCode": 200,
      "message": "User fetched successfully",
      "user": { ... }
    }
    ```

- **Update User**:
  - `PUT /api/user/update-user`
  - Requires `Authorization` header with a valid JWT token.
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "phoneNumber": "+1234567890"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 200,
      "message": "User updated successfully",
      "user": { ... }
    }
    ```

- **Update User Address**:
  - `PUT /api/user/update-user-address`
  - Requires `Authorization` header with a valid JWT token.
  - Request Body:
    ```json
    {
      "address1": "123 Main St",
      "address2": "Apt 4B",
      "address3": "New York, NY"
    }
    ```
  - Response:
    ```json
    {
      "statusCode": 200,
      "message": "User address updated successfully",
      "user": { ... }
    }
    ```

## Error Handling

- Uses [`ApiError`](src/utils/ApiError.js) for custom errors and logging.
- [`asyncHandler`](src/utils/asyncHandler.js) wraps async routes for consistent error responses.

## Logging System

- Logs are written to files if `enableLogging=true`, otherwise to console.
- Log format: `[Timestamp] - [Category]: [Message]`
- IST timezone is used for all timestamps.
- Log files are specified by `serverLogs` and `errorLogs` in `.env`.

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- cors: Cross-Origin Resource Sharing
- cookie-parser: Cookie parsing middleware
- jsonwebtoken: JWT authentication
- dotenv: Environment variable management
- twilio: Twilio API integration
- @aws-sdk/client-secrets-manager: AWS Secrets Manager integration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC