import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';

let pems: Record<string, string> | null = null;

async function getPems() {
  if (pems) return pems;
  const region = process.env.AWS_REGION;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const { data } = await axios.get(url);
  pems = {};
  for (const key of data.keys) {
    pems[key.kid] = jwkToPem(key);
  }
  return pems;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.decode(token, { complete: true }) as any;
    if (!decoded) throw new Error('Invalid token');
    const kid = decoded.header.kid;
    const p = await getPems();
    const pem = p[kid];
    if (!pem) throw new Error('Invalid token');
    jwt.verify(token, pem, { algorithms: ['RS256'] });
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
