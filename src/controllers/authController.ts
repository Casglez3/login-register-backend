import { Request, Response } from 'express';
import User, { findOneUser, createUser } from '../models/users';
import jwt from 'jsonwebtoken';


const passwordValidationRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}

// Crear un nuevo usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await findOneUser(userName);
    if (existingUser) {
      res.status(400).json({ message: 'The user name already exists' });
      return;
    }

    // Validar la contraseña
    if (!passwordValidationRegex.test(password)) {
        res.status(400).json({ message: 'password must contain at least one lowercase letter, one uppercase letter, one number and one special character' });
        return;
      }

    // Crear el usuario
    const user = await createUser(userName, password);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error when registering the user', error);
    res.status(500).json({ message: 'Error when registering the user' });
  }
}


// Controlador de Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {

  try {
    const { userName, password } = req.body;

    // Verifica si el usuario existe
    const user = await User.findOne({ userName });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verifica si la contraseña es correcta
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Incorrect password' });
      return;
    }

    // Genera un token JWT, se indica la expiración del token en 1h
    const token = jwt.sign({ id: user._id, userName: user.userName }, JWT_SECRET, { expiresIn: '1h' });

    // Devuelve el token y el usuario
    res.json({ message: 'Successful login', token });
  } catch (error) {
    console.error('Error when logging in', error);
    res.status(500).json({ message: 'Error when logging in' });
  }
};