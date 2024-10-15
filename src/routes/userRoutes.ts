import { Router } from "express";
import { deleteUser, findUserById, updateUser, findUserByName } from "../controllers/userController";
import { authenticateJWT } from "../middleware/auth";

const userRouter = Router();

//Aplicamos el middleware de autenticación a todas las rutas
userRouter.use(authenticateJWT);

//Ruta para encontrar un usuario por su id
userRouter.get("/:id", findUserById);

//Ruta para obtener un usuario por su nombre
userRouter.get("/user/:userName", findUserByName);

//Ruta para actualizar un usuario
userRouter.put("/:id", updateUser);

//Ruta para eliminar un usuario
userRouter.delete("/:id", deleteUser);

export default userRouter;

