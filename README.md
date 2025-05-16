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

> **Note:** If you deploy with AWS Secrets Manager, the MongoDB URI and port can be fetched automatically. See `src/aws/aws-secerets.js`.

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
    docker run -p 3000:3000 --env-file .env onlyclick-server
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
│   ├── database/
│   │   └── catalog.js        # Database connection setup
│   └── utils/
│       ├── ApiError.js       # Custom error handling
│       ├── ApiResponse.js    # Standardized API responses
│       ├── asyncHandler.js   # Async error handling middleware
│       ├── constants.js      # Application constants
│       ├── logentries.js     # Logging utility
│       └── validation.js     # (Unused duplicate logging utility)
├── dockerfile                # Docker configuration
├── compose.yaml              # Docker Compose configuration
└── package.json              # Project dependencies
```

## Key Components

### 1. Main Application (`index.js`)
- Sets up Express server, middleware (CORS, JSON parsing, cookies).
- Connects to MongoDB using `src/database/catalog.js`.
- Loads secrets from AWS if configured.
- Root endpoint: `GET /` returns server status.

### 2. Database Connection (`src/database/catalog.js`)
- Connects to MongoDB using Mongoose.
- Uses `DB_URL` from `.env` or from AWS Secrets Manager.
- Logs connection status using `makeLog`.

### 3. AWS Secrets Manager (`src/aws/aws-secerets.js`)
- Fetches secrets (MongoDB URI, port) from AWS.
- Exports `MONGO_URI` and `PORT` for use in the app.

### 4. Utility Functions

- **API Response Handler** (`ApiResponse.js`): Standardized API response format.
- **Error Handler** (`ApiError.js`): Custom error class, logs errors.
- **Async Handler** (`asyncHandler.js`): Async route handler wrapper.
- **Constants** (`constants.js`): User roles, service categories, subcategories, status enums, OTP event types.
- **Logging System** (`logentries.js`): Timestamped logging (IST), file or console output.

> Note: `src/utils/validation.js` contains a duplicate `makeLog` function and is not used elsewhere.

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Root Endpoint
- `GET /`
  - Returns server status
  - Response: `"serverconnected"` or `"servernot connected"`

## Error Handling

- Uses `ApiError` for custom errors and logging.
- `asyncHandler` wraps async routes for consistent error responses.

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
- @aws-sdk/client-secrets-manager: AWS Secrets Manager integration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC