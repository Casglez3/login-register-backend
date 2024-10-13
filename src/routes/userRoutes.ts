import { Router } from "express";
import { deleteUser, findUserById, updateUser } from "../controllers/userController";

const userRouter = Router();

//Ruta para encontrar un usuario por su id
userRouter.get('/:id', findUserById);

//Ruta para actualizar un usuario
userRouter.put('/:id', updateUser);

//Ruta para eliminar un usuario
userRouter.delete('/:id', deleteUser);

export default userRouter;

