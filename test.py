# Use the native inference API to send a text message to Amazon Titan Text G1 - Express.

import boto3
import json

from botocore.exceptions import ClientError

# プロファイルの指定
session = boto3.Session(profile_name='aws_poc')

# Create an Amazon Bedrock Runtime client.
brt = session.client("bedrock-runtime")

# Set the model ID, e.g., Amazon Titan Text G1 - Express.S
model_id = "amazon.titan-text-express-v1"

# Define the prompt for the model.
prompt = "こんにちは、あなたは誰ですか？"

# Format the request payload using the model's native structure.
native_request = {
    "inputText": prompt,
    "textGenerationConfig": {
        "maxTokenCount": 512,
        "temperature": 0.5,
        "topP": 0.5
    },
}

# Convert the native request to JSON.
request = json.dumps(native_request)

try:
    # Invoke the model with the request.
    response = brt.invoke_model(modelId=model_id, body=request)

except (ClientError, Exception) as e:
    print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
    exit(1)

# Decode the response body.
model_response = json.loads(response["body"].read())

# Extract and print the response text.
response_text = model_response["results"][0]["outputText"]
print(response_text)