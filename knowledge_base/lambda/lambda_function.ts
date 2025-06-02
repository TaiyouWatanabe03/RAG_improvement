import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const client = new BedrockAgentRuntimeClient({
    region: process.env.REGION,
  });

  const body = JSON.parse(event.body || '{}');
  const query = body.query || 'What is in the knowledge base?';

  const input = {
    knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID!,
    input: {
      text: query,
    },
    retrievalConfiguration: {
      vectorSearchConfiguration: {
        numberOfResults: 3,
      },
    },
  };

  try {
    const command = new RetrieveAndGenerateCommand(input);
    const response = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
