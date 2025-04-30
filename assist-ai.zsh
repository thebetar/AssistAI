#!/bin/zsh

# Check if question is provided as argument
if [ $# -eq 0 ]; then
    echo "Please provide a question as argument"
    echo "Usage: $0 'Your question here'"
    exit 1
fi

# Store the question from first argument
question="$1"

# Make the API call and get direct response
response=$(curl -s "http://localhost:12345/question" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"question\":\"$question\"}")

# Check if curl request was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to connect to server"
    exit 1
fi

# Print the response
echo $response