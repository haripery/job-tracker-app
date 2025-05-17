import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import companyRoutes from './routes/companies';
import { authMiddleware } from './middleware/auth';
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const command = new AdminInitiateAuthCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
    ClientId: process.env.COGNITO_CLIENT_ID || '',
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  try {
    const response = await cognitoClient.send(command);
    const result = response.AuthenticationResult;
    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      email,
      token: result.AccessToken,
      idToken: result.IdToken,
      refreshToken: result.RefreshToken,
    });
  } catch (err) {
    console.error('Cognito auth error', err);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.use('/companies', authMiddleware, companyRoutes);

export default app;
