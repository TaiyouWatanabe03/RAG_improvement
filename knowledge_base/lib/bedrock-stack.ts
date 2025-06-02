import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

interface BedrockStackProps extends StackProps {
  collectionArn: string;
}

export class BedrockStack extends Stack {
  constructor(scope: Construct, id: string, props: BedrockStackProps) {
    super(scope, id, props);

    // S3バケット
    const bucket = new s3.Bucket(this, 'DocumentBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Bedrock 実行ロール
    const role = new iam.Role(this, 'BedrockExecutionRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonBedrockFullAccess'),
      ],
    });

    // Bedrock Knowledge Base
    const knowledgeBase = new bedrock.CfnKnowledgeBase(this, 'KnowledgeBase', {
      name: 'simple-knowledge-base',
      description: 'Simple KB',
      roleArn: role.roleArn,
      knowledgeBaseConfiguration: {
        type: 'VECTOR',
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: `arn:aws:bedrock:${this.region}::foundation-model/amazon.titan-embed-text-v1`,
        },
      },
      storageConfiguration: {
        type: 'OPENSEARCH_SERVERLESS',
        opensearchServerlessConfiguration: {
          collectionArn: props.collectionArn,
          vectorIndexName: 'simple-index',
          fieldMapping: {
            vectorField: 'vector',
            textField: 'text',
            metadataField: 'metadata',
          },
        },
      },
    });

    // Lambda関数
    const bedrockLambda = new lambda.Function(this, 'BedrockQueryLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'lambda_function.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/dist')),
      environment: {
        KNOWLEDGE_BASE_ID: knowledgeBase.ref,
        REGION: this.region,
      },
    });

    bedrockLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['bedrock:*'],
      resources: ['*'],
    }));

    // API Gateway
    const api = new apigateway.RestApi(this, 'BedrockQueryApi', {
      restApiName: 'Bedrock Query Service',
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(bedrockLambda);
    api.root.addMethod('POST', lambdaIntegration);
  }
}