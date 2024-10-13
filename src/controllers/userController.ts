import { deleteUserById, findOneUserById, updateUserById } from "../models/users";
import { Request, Response } from 'express';

const passwordValidationRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//Función para encontrar un usuario por su id
export const findUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = await findOneUserById(id);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error when finding the user by id', error);
        res.status(500).json({ message: 'Error when finding the user by id' });
    }
}

//Función para actualizar un usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const { userName, password } = req.body;

        // Validar la contraseña
        if (!passwordValidationRegex.test(password)) {
            res.status(400).json({ message: 'The password must contain at least 8 characters, a lowercase letter, an uppercase letter, a digit and a special character.' });
            return;
        }
        
        await updateUserById(id, userName, password);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error when updating the user', error);
        res.status(500).json({ message: 'Error when updating the user' });
    }
}

//Función para eliminar un usuario
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        await deleteUserById(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error when deleting the user', error);
        res.status(500).json({ message: 'Error when deleting the user' });
    }
}
