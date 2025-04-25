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
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Install git for syncing
RUN apt-get update && apt-get install -y git

# Copy requirements and install dependencies
COPY server/requirements.txt /app
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
RUN pip install --no-cache-dir "fastapi[standard]" uvicorn

# Copy the rest of the application code
COPY server/src /app

# Copy the built Solid.js app from the previous stage
COPY --from=build /app/dist /app/client

# Expose the port FastAPI will run on
EXPOSE 12345

# Run the application with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "12345"]