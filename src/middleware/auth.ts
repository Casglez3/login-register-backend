import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


// Middleware para autenticar el token, además se indica que si el token no es válido o ha expirado, se lance un error
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined");
}

//Lógica para verificar el token
export const authenticateJWT = (req: Request, res: Response, next: NextFunction):void => {
  const token = req.header("Authorization")?.split(" ")[1]; // Leer el token de la cabecera

  //Si no hay token, devolvemos un 403
  if (!token) {
    res.status(403).json({ message: "Token not provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verificar el token
    req.user = decoded as JwtPayload
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
