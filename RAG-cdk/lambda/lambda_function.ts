// lambda関数
// import { S3 } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import {S3} from '@aws-sdk/client-s3';


const s3 = new S3();
const BUCKET_NAME = process.env.BUCKET_NAME!;
const file_keys = 'Hello.txt';
console.log('BUCKET_NAME:', BUCKET_NAME);

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const data = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: file_keys,
    });

  
    const body = await data.Body?.transformToString();
    if (!body) {
      throw new Error('No body found in S3 object');
    }
    
    return {
      statusCode: 200,
      body,
    };
    
    
  } catch (err) {
    console.error('Lambda Error:', err);
    return {
      statusCode: 200,
      body: `DEBUG ERROR: ${JSON.stringify(err)}`,
    };
  }
};

