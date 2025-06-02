#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { OpenSearchStack } from '../lib/opensearch-stack';
import { BedrockStack } from '../lib/bedrock-stack';

const app = new App();

// OpenSearchStack を先にデプロイして、collectionArn を取得
const opensearch = new OpenSearchStack(app, 'OpenSearchStack', {
  env: { region: 'ap-northeast-1' }, // 東京リージョン
});

// BedrockStack に collectionArn を渡してデプロイ
new BedrockStack(app, 'BedrockStack', {
  env: { region: 'ap-northeast-1' },
  collectionArn: opensearch.collection.attrArn,
});