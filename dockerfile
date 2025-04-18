# Use a base Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt /app
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
RUN pip install --no-cache-dir "fastapi[standard]" uvicorn

# Copy the rest of the application code
COPY src /app

# Expose the port FastAPI will run on
EXPOSE 12345

# Run the application with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "12345"]