# Job Tracker

This repository contains a minimal full-stack example with a Next.js frontend, a Node.js REST API and a GraphQL server. Dockerfiles are provided for each service.

## Local development

### Prerequisites

- Node.js 18
- Docker (optional for container builds)
- PostgreSQL database for the REST API

### Environment variables

The services rely on several variables. Default fallbacks are used when these are not set.

| Variable | Description | Default |
|---|---|---|
| `AUTH_ENDPOINT` | Login endpoint used by the frontend credentials provider. | `http://localhost:3001/login` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | GraphQL endpoint used by the frontend. | `http://localhost:4000/graphql` |
| `DATABASE_URL` | Connection string for the REST API database. | (none) |
| `JWT_SECRET` | Secret used to sign REST API JWTs. | `secret` |
| `PORT` | Port for the REST or GraphQL services. | `3001` for REST, `4000` for GraphQL |

### Running the services

1. **REST API**
   ```bash
   cd rest-api
   npm install      # assumes a package.json exists
   npm run dev      # or `node src/server.ts`
   ```
2. **GraphQL server**
   ```bash
   cd graphql-server
   npm install
   npm run dev
   ```
3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Dockerfiles are available (`Dockerfile.frontend`, `Dockerfile.graphql`, `Dockerfile.rest`) if you prefer to run each service in a container.

## Smithy TypeScript client

The `smithy` directory contains a [Smithy](https://smithy.io/) model describing
the REST API. Running a Smithy build generates a TypeScript client under
`smithy/typescript-client`. The GraphQL server imports the generated `Company`
type from this client to ensure the REST and GraphQL layers stay in sync.

To generate the client run:

```bash
cd smithy
gradle build
```

The generated sources can then be consumed by the GraphQL server.

## CDK deployment

If an AWS CDK stack is provided (not included in this repository) the general workflow is:

```bash
cd infrastructure
npm install
npx cdk deploy
```

Ensure your AWS credentials are configured prior to running `cdk deploy`.

## Cognito authentication

The sample uses [NextAuth.js](https://next-auth.js.org/) with a Credentials provider. The `/login` route in the REST API currently returns a placeholder JWT. To integrate Amazon Cognito you would update the login handler to authenticate against Cognito and return the issued JWT. The frontend would then use this token for API calls.

## GitHub Actions secrets

The `deploy.yml` workflow pushes Docker images to Amazon ECR and deploys to ECS. Create an IAM user with permissions for ECR and ECS and generate an access key pair. Add the following repository secrets in GitHub:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `ECR_REGISTRY` – your ECR registry URL (e.g. `123456789012.dkr.ecr.us-east-1.amazonaws.com`)

With these secrets configured, pushes to the `main` branch will trigger the CI/CD workflow.
