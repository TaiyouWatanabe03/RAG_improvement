"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_bedrock_agent_runtime_1 = require("@aws-sdk/client-bedrock-agent-runtime");
const handler = async (event) => {
    const client = new client_bedrock_agent_runtime_1.BedrockAgentRuntimeClient({ region: process.env.REGION });
    const body = JSON.parse(event.body || '{}');
    const query = body.query || 'What is in the knowledge base?';
    const input = {
        knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
        input: { text: query },
        retrievalConfiguration: {
            vectorSearchConfiguration: { numberOfResults: 3 },
        },
    };
    try {
        const command = new client_bedrock_agent_runtime_1.RetrieveAndGenerateCommand(input);
        const response = await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
exports.handler = handler;
