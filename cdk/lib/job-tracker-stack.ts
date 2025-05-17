import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';

export class JobTrackerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPC and ECS Cluster
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    // ECR repositories
    const frontendRepo = new ecr.Repository(this, 'FrontendRepo', {
      repositoryName: 'job-tracker-frontend',
    });
    const graphqlRepo = new ecr.Repository(this, 'GraphqlRepo', {
      repositoryName: 'job-tracker-graphql',
    });
    const restRepo = new ecr.Repository(this, 'RestRepo', {
      repositoryName: 'job-tracker-rest',
    });

    // Fargate services
    const frontendService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'FrontendService',
      {
        cluster,
        cpu: 256,
        desiredCount: 1,
        memoryLimitMiB: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(frontendRepo, 'latest'),
          containerPort: 3000,
        },
        publicLoadBalancer: true,
      },
    );

    const graphqlService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'GraphqlService',
      {
        cluster,
        cpu: 256,
        desiredCount: 1,
        memoryLimitMiB: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(graphqlRepo, 'latest'),
          containerPort: 4000,
        },
        publicLoadBalancer: true,
      },
    );

    const restService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'RestService',
      {
        cluster,
        cpu: 256,
        desiredCount: 1,
        memoryLimitMiB: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(restRepo, 'latest'),
          containerPort: 3001,
        },
        publicLoadBalancer: true,
      },
    );

    // Cognito User Pool & Identity Pool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
    });

    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    const authenticatedRole = new iam.Role(this, 'CognitoDefaultAuthRole', {
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });

    new cognito.CfnIdentityPoolRoleAttachment(this, 'DefaultAuthRoleAttachment', {
      identityPoolId: identityPool.ref,
      roles: { authenticated: authenticatedRole.roleArn },
    });

    // Outputs
    new CfnOutput(this, 'FrontendUrl', {
      value: `http://${frontendService.loadBalancer.loadBalancerDnsName}`,
    });
    new CfnOutput(this, 'GraphqlUrl', {
      value: `http://${graphqlService.loadBalancer.loadBalancerDnsName}`,
    });
    new CfnOutput(this, 'RestUrl', {
      value: `http://${restService.loadBalancer.loadBalancerDnsName}`,
    });
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
    new CfnOutput(this, 'IdentityPoolId', { value: identityPool.ref });
  }
}
