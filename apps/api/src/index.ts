import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from '@sales-crm/database';
import { verifyJWT, JWTPayload } from '@sales-crm/auth';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Extend Express Request type to include tenant JWT payload
interface AuthenticatedRequest extends Request {
  tenant?: JWTPayload;
}

// Authentication Middleware
async function authenticateTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyJWT(token);

  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  req.tenant = payload;
  next();
}

// Public Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'sales-crm-api' });
});



// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Sales CRM API Gateway running on port ${PORT}`);
});
