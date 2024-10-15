import { JwtPayload } from "jsonwebtoken";

// Sobreescribimos la interfaz Request de Express para añadir el campo user
declare module "express-serve-static-core" {
  namespace Express {
    interface Request {
      user?: JwtPayload; 
    }
  }
}
