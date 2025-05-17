# Infrastructure

This CDK app defines the AWS infrastructure for the Job Tracker project.

It creates a VPC, ECS cluster, ECR repositories, Fargate services for the
frontend, GraphQL server and REST API, and Cognito user/identity pools.

Run `npx cdk deploy` from this directory to deploy the stack. The stack outputs
include the service URLs and Cognito identifiers used by the application.
