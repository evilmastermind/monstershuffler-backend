# Use an official Node runtime as the base image
FROM node:20

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
# RUN apt-get update && apt-get install -y git && npm install -g yarn
# Use a deeper clone with more retries
RUN git config --global http.postBuffer 524288000 && \
    git config --global core.compression 0 && \
    git config --global http.version HTTP/1.1

# Install packages
RUN yarn install --network-timeout 600000 --verbose

# Copy the rest of the project files
COPY . .

# Build the project
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/app.js"]
