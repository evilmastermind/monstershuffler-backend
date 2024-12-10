# Use an official Node runtime as the base image
FROM node:20-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the project files
COPY . .

# Build the project
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/app.js"]
