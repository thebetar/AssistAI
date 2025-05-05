# Build the Solid.js app
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY client/package.json client/package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY client/ /app/

# Build the Solid.js app
RUN npm run build

# Use a base Python image
FROM node:20

# Set the working directory
WORKDIR /app

# Install git for syncing
RUN apt-get update && apt-get install -y git

# Copy requirements and install dependencies
COPY server/package.json server/package-lock.json /app/
RUN npm install

# Copy the rest of the application code
COPY server/src /app

# Copy the built Solid.js app from the previous stage
COPY --from=build /app/dist /app/client

# Expose the port FastAPI will run on
EXPOSE 12345

# Run the application with uvicorn
CMD ["npm", "run", "start"]