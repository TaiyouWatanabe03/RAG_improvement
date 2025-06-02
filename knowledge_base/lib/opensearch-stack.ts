import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchserverless';

export class OpenSearchStack extends Stack {
  public readonly collection: opensearch.CfnCollection;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.collection = new opensearch.CfnCollection(this, 'VectorCollection', {
      name: 'simple-vector-collection',
      type: 'VECTORSEARCH',
    });
  }
}