import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class RagCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    });

    // S3バケット作成
    const bucket = new s3.Bucket(this, 'MyFileBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Lambda関数の作成
    const fn = new lambdaNodejs.NodejsFunction(this, 'MyLambdaFunction', {
      entry: path.join(__dirname, '../lambda/lambda_function.ts'),
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      bundling: {
        externalModules: ['aws-sdk'], // Lambda上ではプリインストール済み
      },
    });

    // Lambda に S3 読み取り権限を付与
    bucket.grantRead(fn);

    // API Gateway 作成
    new apigateway.LambdaRestApi(this, 'MyApiGateway', {
      handler: fn,
      proxy: true,
    });
  }
}