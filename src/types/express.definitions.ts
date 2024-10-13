import { JwtPayload } from 'jsonwebtoken';

// Sobreescribimos la interfaz Request de Express para añadir el campo user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; 
    }
  }
}
