import * as cdk from 'aws-cdk-lib';
// import {S3} from '@aws-cdk/client-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { Construct } from 'constructs';
import { CONFIG } from '../config';

interface BedrockStackProps extends cdk.StackProps {
    collectionArn: string;
    bucketArn: string;
    bedrockRoleArn: string;
}

export class BedrockStack extends cdk.Stack {


    // Agent Roleの作成
    constructor(scope: Construct, id: string, props: BedrockStackProps) {
        super(scope, id, props);



        // Agent Role
        const agentRole = new iam.CfnRole(this, 'AgentRole', {
            roleName: 'AmazonBedrockExecutionRoleForAgents_cdk',
            assumeRolePolicyDocument: {
                Statement: [{
                    Effect: 'Allow',
                    Principal: {
                        Service: 'bedrock.amazonaws.com'
                    },
                    Action: 'sts:AssumeRole'
                }]
            },
            managedPolicyArns: ['arn:aws:iam::aws:policy/AmazonBedrockFullAccess']
        });



        // knowledge Base
        const knowledgeBase = new bedrock.CfnKnowledgeBase(this, 'KnowledgeBase', {
            name: CONFIG.collectionName,
            description: 'Answers on basis of data in knowledge base',
            roleArn: props.bedrockRoleArn,
            knowledgeBaseConfiguration: {
                type: 'VECTOR',
                vectorKnowledgeBaseConfiguration: {
                    embeddingModelArn: `arn:aws:bedrock:${this.region}::foundation-model/amazon.titan-embed-text-v1`
                }
            },
            storageConfiguration: {
                type: 'OPENSEARCH_SERVERLESS',
                opensearchServerlessConfiguration: {
                    collectionArn: props.collectionArn,
                    vectorIndexName: CONFIG.indexName,
                    fieldMapping: {
                        vectorField: 'vector',
                        textField: 'text',
                        metadataField: 'metadata'
                    }
                }
            }
        });
        return;



        //データソースの作成
        const dataSource = new bedrock.CfnDataSource(this, 'DataSource', {
            knowledgeBaseId: knowledgeBase.ref,
            name: 'CONFIG.collectionName',
            dataSourceConfiguration: {
                type: 'S3',
                s3Configuration: {
                    bucketArn: props.bucketArn
                }
            }
        });


        // const Agent = new bedrock.CfnAgent(this, 'Agent', {
        //     agentName: 'cdk-agent',
        //     knowledgeBaseId: knowledgeBase.ref,
        //     roleArn: agentRole.attrArn
        // });


    }
}

