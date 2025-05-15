ARG NODE_VERSION=23.11.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /

# Copy the rest of the source files into the image.
COPY package*.json ./
RUN npm install
COPY . .

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
CMD npm run start
