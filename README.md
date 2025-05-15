# OnlyClick Server

A Node.js/Express.js backend service for a home services marketplace platform. This server handles service bookings, user management, and various home service categories like electrical work, plumbing, cleaning, etc.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Logging System](#logging-system)

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
PORT=3000
DB_URL=mongodb://localhost:27017/onlyclick
enableLogging=true
serverLogs=./logs/server.log
errorLogs=./logs/error.log
```

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
docker run -p 3000:3000 onlyclick-server
```

Or use Docker Compose:
```bash
docker-compose up
```

## Project Structure

```
onlyclick-server/
├── src/
│   ├── app.js              # Main application entry point
│   ├── database/
│   │   └── catalog.js      # Database connection setup
│   └── utils/
│       ├── ApiError.js     # Custom error handling
│       ├── ApiResponse.js  # Standardized API responses
│       ├── asyncHandler.js # Async error handling middleware
│       ├── constants.js    # Application constants
│       ├── logentries.js   # Logging utility
│       └── validation.js   # Validation utilities
├── dockerfile             # Docker configuration
├── compose.yaml          # Docker Compose configuration
└── package.json          # Project dependencies
```

### Key Components

#### 1. Main Application (`app.js`)
- Express server setup
- Middleware configuration (CORS, JSON parsing, cookie parsing)
- Database connection initialization
- Basic route setup

#### 2. Database Connection (`catalog.js`)
- MongoDB connection using Mongoose
- Connection status logging
- Environment-based configuration

#### 3. Utility Functions

##### API Response Handler (`ApiResponse.js`)
- Standardized API response format
- Methods:
  - `success()`: 200 OK responses
  - `error()`: Custom error responses
  - `badRequest()`: 400 Bad Request responses
  - `unauthorized()`: 401 Unauthorized responses

##### Error Handler (`ApiError.js`)
- Custom error class for API errors
- Integrated logging
- Error type handling

##### Async Handler (`asyncHandler.js`)
- Async route handler wrapper
- Error catching and formatting
- Stack trace handling

##### Constants (`constants.js`)
- User roles: user, task, admin, contractor
- Service categories:
  - Electrician
  - Plumber
  - Cleaner
  - Carpenter
  - Painting
  - AC
- Service subcategories with detailed options
- Booking status enums
- OTP event types

##### Logging System (`logentries.js`)
- Timestamp-based logging with IST timezone
- File and console logging support
- Configurable through environment variables

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Root Endpoint
- `GET /`
  - Returns server status
  - Response: `{ "message": "server" }`

## Error Handling

The application uses a standardized error handling system:

1. **API Errors**
   - Custom error class with status codes
   - Detailed error messages
   - Stack trace logging

2. **Async Error Handling**
   - Automatic error catching
   - Formatted error responses
   - Development mode stack traces

## Logging System

The application includes a comprehensive logging system:

1. **Log Types**
   - Server logs
   - Error logs
   - Database connection logs

2. **Log Format**
   ```
   [Timestamp] - [Category]: [Message]
   ```

3. **Configuration**
   - Enable/disable through environment variables
   - File or console output options
   - IST timezone support

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- cors: Cross-Origin Resource Sharing
- cookie-parser: Cookie parsing middleware
- jsonwebtoken: JWT authentication
- dotenv: Environment variable management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC 