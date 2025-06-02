#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { KnowledgeBaseStack } from '../lib/knowledge_base-stack';
import { BedrockStack } from '../lib/stacks/bedrock-stack';
// import { OpenSearchStack } from '../lib/stacks/opensearch-stack';
// import { BedrockStack } from '../lib/stacks/bedrock-stack';


const app = new cdk.App();

// はじめに、OpenSeaerch Stackをdeployします。
// const opensearchStack = new OpenSearchStack(app, 'OpenSearchStack', {
//   // env:{
//   //   account:process.env.CDK_DEFAULT_ACCOUNT,
//   //   region:process.env.CDK_DEFAULT_REGION || 'ap-northeast-1'
//   // }
// });

// 次に、Bedrock Stackをdeployします。

const bedrockStack = new BedrockStack(app,'BedrockStack', {
  collectionArn: 'arn:aws:bedrock:us-east-1:111122223333:collection/cdk-collection',
  bucketArn: 'arn:aws:s3:::cdk-bucket',
  bedrockRoleArn: 'arn:aws:iam::111122223333:role/iamrole'
});