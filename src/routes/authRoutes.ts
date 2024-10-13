import { Router } from "express";
import { loginUser, register } from "../controllers/authController";

const authRouter = Router();

//Ruta para crear un nuevo usuario (registro)
authRouter.post('/register', register);

// Ruta de login
authRouter.post('/login', loginUser);

export default authRouter;