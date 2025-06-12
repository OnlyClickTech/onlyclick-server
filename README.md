# OnlyClick Server Documentation

## Overview

**OnlyClick Server** is a Node.js/Express.js backend for a home services marketplace. It manages user authentication (OTP-based), service listings, bookings, reviews, and user profiles. The backend uses MongoDB for data storage, Twilio for OTP, and JWT for authentication.

---

## Project Structure

```
onlyclick-server/
├── index.js                  # Main application entry point
├── dockerfile                # Docker build instructions
├── package.json              # Project dependencies and scripts
├── README.md                 # Project documentation
├── src/
│   ├── aws/
│   │   └── aws-secerets.js   # AWS Secrets Manager integration
│   ├── controllers/          # Route controllers (business logic)
│   ├── database/
│   │   └── catalog.js        # MongoDB connection logic
│   ├── middlewares/
│   │   └── auth.middleware.js # JWT authentication middleware
│   ├── models/               # Mongoose schemas
│   ├── otp/                  # OTP and JWT services
│   ├── routes/               # Express route definitions
│   ├── utils/                # Utility functions and helpers
```

---

## Environment Variables

Create a `.env` file in the root directory with:

| Variable                | Description                        |
|-------------------------|------------------------------------|
| PORT                    | Server port                        |
| ACCESS_TOKEN_SECRET     | JWT access token secret            |
| REFRESH_TOKEN_SECRET    | JWT refresh token secret           |
| MONGO_URI               | MongoDB connection string          |
| TWILIO_ACCOUNT_SID      | Twilio account SID                 |
| TWILIO_AUTH_TOKEN       | Twilio auth token                  |
| TWILIO_SERVICE_SID      | Twilio Verify service SID          |
| enableLogging           | Enable/disable file logging        |
| serverLogs              | Path to server log file            |
| errorLogs               | Path to error log file             |

---

## Key Modules & Services

### 1. Main Application (`index.js`)
- Sets up Express, CORS, cookie parser, and JSON parsing.
- Loads environment variables.
- Connects to MongoDB.
- Registers all API routes.
- Root endpoint: `GET /` returns `"server"`.

### 2. AWS Secrets (`src/aws/aws-secerets.js`)
- Loads secrets from AWS Secrets Manager for secure config.

### 3. Database Connection (`src/database/catalog.js`)
- Connects to MongoDB using Mongoose.
- Logs connection status.

### 4. Middleware

#### `auth.middleware.js`
- Verifies JWT access/refresh tokens.
- Attaches user object to `req.user` if valid.
- Returns 401 for missing/invalid/expired tokens.

### 5. Utilities (`src/utils/`)
- **ApiError.js**: Custom error class, logs errors.
- **ApiResponse.js**: Standardizes API responses.
- **asyncHandler.js**: Wraps async route handlers for error catching.
- **logentries.js**: Logging utility (console or file).
- **constants.js**: Service categories, roles, and enums.
- **bookingIdGeneration.js**: Generates unique booking IDs.
- **bookingOtpGeneration.js**: Generates OTPs for bookings.
- **userIdGeneration.js**: Generates unique user IDs.
- **servicereview.js**: Calculates average service rating.

---

## Database Models

### User (`src/models/users.model.js`)
| Field        | Type     | Description                |
|--------------|----------|----------------------------|
| name         | String   | User's name                |
| userId       | String   | Unique user ID             |
| phoneNumber  | String   | User's phone number        |
| roles        | String   | User role (default: user)  |
| address      | Array    | List of addresses          |
| email        | String   | User's email               |
| timestamps   | Date     | Created/updated at         |

- **Methods**: `generateAccessToken()`, `generateRefreshToken()`

### Address (`src/models/address.model.js`)
| Field     | Type   | Description         |
|-----------|--------|---------------------|
| address1  | String | Required            |
| address2  | String | Optional            |
| address3  | String | Optional            |

### Service (`src/models/service.model.js`)
| Field         | Type     | Description                |
|---------------|----------|----------------------------|
| serviceId     | String   | Unique service ID          |
| category      | String   | Service category           |
| subCategory   | String   | Service subcategory        |
| description   | String   | Service description        |
| price         | Number   | Service price              |
| duration      | Number   | Duration in hours          |
| reviews       | Array    | List of reviews            |
| averageRating | Number   | Average rating (1-5)       |

### Booking (`src/models/booking.model.js`)
| Field         | Type     | Description                |
|---------------|----------|----------------------------|
| userId        | String   | User who booked            |
| bookingId     | String   | Unique booking ID          |
| bookingDate   | Date     | Date of booking            |
| status        | String   | pending/confirmed/cancelled|
| startOtp      | String   | OTP for start              |
| endOtp        | String   | OTP for end                |
| category      | String   | Service category           |
| subCategory   | String   | Service subcategory        |
| price         | Number   | Price                      |
| taskmasterId  | String   | Assigned worker            |
| payment       | Object   | Payment status/amount      |

### Review (`src/models/review.model.js`)
| Field     | Type   | Description         |
|-----------|--------|---------------------|
| userId    | String | Reviewer            |
| bookingId | String | Booking reviewed    |
| rating    | Number | 1-5                 |
| comment   | String | Review text         |
| createdAt | Date   | Date of review      |

---

## API Endpoints

### Authentication

#### 1. Send OTP
- **POST** `/api/auth/send-otp`
- **Body**: `{ "phoneNumber": "+1234567890" }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "OTP sent successfully" }`
  - 400: `{ "statusCode": 400, "message": "Phone number is required" }`
- **Edge Cases**: Phone number missing/invalid.
- **Middleware**: None.

#### 2. Verify OTP
- **POST** `/api/auth/verify-otp`
- **Body**: `{ "phoneNumber": "+1234567890", "code": "123456" }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Logged in successfully", "data": { "accessToken": "...", "refreshToken": "...", "user": {...}, "accessTokenExpiry": "...", "refreshTokenExpiry": "..." } }`
  - 400: `{ "statusCode": 400, "message": "Invalid or expired OTP" }`
- **Edge Cases**: OTP expired, wrong code, phone not found.
- **Middleware**: None.

---

### User

#### 1. Get User
- **GET** `/api/user/get-user`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "User fetched successfully", "user": {...} }`
  - 400/404: User not found or token invalid.
- **Middleware**: `authenticateUser`

#### 2. Update User
- **PUT** `/api/user/update-user`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ "name": "John", "phoneNumber": "+1234567890", "email": "john@example.com" }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "User updated successfully", "user": {...} }`
  - 400: Missing fields.
  - 404: User not found.
- **Middleware**: `authenticateUser`

#### 3. Update User Address
- **PUT** `/api/user/update-user-address`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ "address1": "...", "address2": "...", "address3": "..." }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "User address updated successfully", "user": {...} }`
  - 400: Missing address.
  - 404: User not found.
- **Middleware**: `authenticateUser`

---

### Service

#### 1. Create Service
- **POST** `/api/service/create-service`
- **Body**: `{ "serviceId": "...", "category": "...", "subCategory": "...", "description": "...", "price": 100, "duration": 2 }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Service created successfully", "data": {...} }`
  - 400: Missing/duplicate fields.
- **Middleware**: None.

#### 2. Get All Services
- **GET** `/api/service/get-service`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Service fetched successfully", "data": [...] }`
  - 404: Not found.
- **Middleware**: None.

#### 3. Update Service
- **PUT** `/api/service/update-service`
- **Body**: `{ "serviceId": "...", "category": "...", "subCategory": "...", "description": "...", "price": 100, "duration": 2 }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Service updated successfully", "data": {...} }`
  - 400/404: Missing fields or not found.
- **Middleware**: None.

#### 4. Delete Service
- **DELETE** `/api/service/delete-service`
- **Body**: `{ "serviceId": "..." }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Service deleted successfully", "data": {...} }`
  - 400/404: Missing or not found.
- **Middleware**: None.

#### 5. Add Review
- **POST** `/api/service/add-review`
- **Body**: `{ "serviceId": "...", "rating": 5, "comment": "Great!" }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Review added successfully", "reviews": [...], "averageRating": 4.5 }`
  - 400/404: Validation errors.
- **Middleware**: None.

#### 6. Get Reviews
- **GET** `/api/service/:serviceId/reviews`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Reviews retrieved successfully", "reviews": [...], "averageRating": 4.5 }`
  - 400/404: Validation errors.
- **Middleware**: None.

---

### Booking

#### 1. Create Booking
- **POST** `/api/booking/create-booking`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ "category": "...", "subcategory": "...", "price": 100, "taskmasterId": "..." }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Booking created successfully", "data": {...} }`
  - 400: Missing fields.
- **Middleware**: `authenticateUser`

#### 2. Get Booking
- **GET** `/api/booking/get-booking`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Booking fetched successfully", "data": [...] }`
  - 400/404: Not found.
- **Middleware**: `authenticateUser`

#### 3. Validate Start OTP
- **PUT** `/api/booking/validate-startotp`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ "bookingId": "...", "startOtp": "123456" }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Start OTP verified successfully", "data": {...} }`
  - 400/404: Invalid OTP or not found.
- **Middleware**: `authenticateUser`

#### 4. Validate End OTP
- **PUT** `/api/booking/validate-endotp`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ "bookingId": "...", "endOtp": "654321" }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "End OTP verified successfully", "data": {...} }`
  - 400/404: Invalid OTP or not found.
- **Middleware**: `authenticateUser`

---

### Review

#### 1. Create Review
- **POST** `/api/review/create-review`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ "bookingId": "...", "rating": 5, "comment": "Great!" }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Review created successfully", "data": {...} }`
  - 400: Missing fields or duplicate review.
- **Middleware**: `authenticateUser`

#### 2. Get User Reviews
- **GET** `/api/review/get-user-reviews`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Reviews fetched successfully", "data": [...] }`
- **Middleware**: `authenticateUser`

#### 3. Get All Reviews
- **GET** `/api/review/get-all-reviews`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "All reviews fetched successfully", "data": [...] }`
- **Middleware**: None.

#### 4. Update Review
- **PUT** `/api/review/update-review`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ "reviewId": "...", "rating": 4, "comment": "Updated comment" }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Review updated successfully", "data": {...} }`
  - 400/404: Missing fields or not found.
- **Middleware**: `authenticateUser`

#### 5. Delete Review
- **DELETE** `/api/review/delete-review`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ "reviewId": "..." }`
- **Response**:
  - 200: `{ "statusCode": 200, "message": "Review deleted successfully" }`
  - 400/404: Missing fields or not found.
- **Middleware**: `authenticateUser`

---

## Error Handling

- **ApiError**: Custom error class, logs errors and returns status code/message.
- **ApiResponse**: Standardizes all API responses for success and error.
- **asyncHandler**: Catches async errors and returns a 510 error for unhandled exceptions.
- **Validation**: All endpoints validate required fields and return 400 for missing/invalid input.
- **JWT Errors**: 401 for missing/invalid/expired tokens.

---

## Third-Party Libraries

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: CORS middleware
- **cookie-parser**: Cookie parsing
- **jsonwebtoken**: JWT authentication
- **dotenv**: Loads environment variables
- **twilio**: SMS/OTP sending
- **@aws-sdk/client-secrets-manager**: AWS Secrets Manager integration

---

## Deployment & Dev Scripts

- **Dev**: `npm run dev` (nodemon)
- **Prod**: `npm start`
- **Docker**: Build with `docker build -t onlyclick-server .` and run with `docker run -p 8000:8000 --env-file .env onlyclick-server`
- **CI/CD**: GitHub Actions workflows for build and deploy (`.github/workflows/ci.yml`, `.github/workflows/cd.yml`)

---

## Testing

- No automated tests are present in the codebase.
- Manual testing can be done using the provided [Postman Collection](https://api.postman.com/collections/27936854-d4aeef8a-8342-494c-9905-64c915509a9d?access_key=PMAT-01JVMCWA6A69XYY0P08AZQWB4P).

---

## Edge Cases & Input Validation

- All endpoints validate required fields and types.
- All authentication-protected routes require a valid JWT.
- OTP endpoints handle expired/invalid codes.
- Booking and service creation check for duplicates.
- Review creation checks for duplicates per booking/user.

---

## Logging

- Logs to file if `enableLogging=true`, otherwise logs to console.
- Log format: `[Timestamp] - [Category]: [Message]`
- Log files: `serverLogs`, `errorLogs` (set in `.env`)

---

For any further details, see the inline comments in each file or reach out to the project maintainers.
