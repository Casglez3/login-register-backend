import request from 'supertest';
import { app, server } from '../src/index';
import mongoose from 'mongoose';
import User from '../src/models/users';


describe('User Registration Test', () => {
    // Antes de comenzar las pruebas, conectamos a la base de datos
    beforeAll(async () => {
        const mongoUri: string = process.env.MONGO_URI || 'mongodb://localhost:27017/login-register';
        await mongoose.connect(mongoUri);
    });

    // Después de todas las pruebas, cerramos la conexión
    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    // Después de cada test, eliminamos los usuarios creados en la base de datos
    afterEach(async () => {
        await User.deleteMany({ userName: 'testUser' }); 
    });


    //PRUEBAS DE REGISTRO DE USUARIOS
    
    // Prueba de registro de usuario
    it('You must register a user correctly', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                userName: 'testUser',
                password: 'Prueba123!'
            });

        expect(response.status).toBe(201); // Esperamos que el código de estado sea 201 (creado)
        expect(response.body).toHaveProperty('_id'); // Esperamos que la respuesta contenga el ID del usuario
        expect(response.body.userName).toBe('testUser'); // El nombre de usuario debe ser "testUser"
    });


    // Prueba de registro de usuario con un nombre de usuario ya existente
    it('You must return an error when trying to register a user with an existing username', async () => {
        // Crear un usuario de prueba
        await User.create({
            userName: 'testUser', password: 'Prueba123!'
        });

        // Intentar registrar un usuario con el mismo nombre de usuario
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                userName: 'testUser', password: 'Prueba123!'
            });

        expect(response.status).toBe(400); // Esperamos que el código de estado sea 400 (solicitud incorrecta)
        expect(response.body).toHaveProperty('message'); // Esperamos que la respuesta contenga un mensaje de error
        expect(response.body.message).toBe('The user name already exists'); // Esperamos que el mensaje de error sea "The user name already exists"
    });


    // Prueba de registro de usuario con una contraseña inválida
    it('You must return an error when trying to register a user with an invalid password', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                userName: 'testUser', password: '123456'
            });

        expect(response.status).toBe(400); // Esperamos que el código de estado sea 400 (solicitud incorrecta)
        expect(response.body).toHaveProperty('message'); // Esperamos que la respuesta contenga un mensaje de error
        expect(response.body.message).toBe('password must contain at least one lowercase letter, one uppercase letter, one number and one special character'); // Esperamos que el mensaje de error sea "password must contain at least one lowercase letter, one uppercase letter, one number and one special character"
    });


    //PRUEBAS DE LOGIN

    // Prueba de inicio de sesión con un usuario existente
    it('You must log in with an existing user', async () => {
        // Crear un usuario de prueba
        await User.create({
            userName: 'testUser', password: 'Prueba123!'
        });

        // Iniciar sesión con el usuario de prueba
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                userName: 'testUser', password: 'Prueba123!'
            });

        expect(response.status).toBe(200); // Esperamos que el código de estado sea 200 (OK)
        expect(response.body).toHaveProperty('token'); // Esperamos que la respuesta contenga un token de autenticación
    }
    );

    // Prueba de inicio de sesión con un usuario no existente
    it('You must return an error when trying to log in with a non-existent user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                userName: 'testUser', password: 'Prueba123!'
            });

        expect(response.status).toBe(404); //  Esperamos que el código de estado sea 404 (no encontrado)
        expect(response.body).toHaveProperty('message'); // Esperamos que la respuesta contenga un mensaje de error
        expect(response.body.message).toBe('User not found'); // Esperamos que el mensaje de error sea "User not found"
    });


    // Prueba de inicio de sesión con una contraseña incorrecta
    it('You must return an error when trying to log in with an incorrect password', async () => {
        // Crear un usuario de prueba
        await User.create({
            userName: 'testUser', password: 'Prueba123!'
        });

        // Iniciar sesión con el usuario de prueba y una contraseña incorrecta
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                userName: 'testUser', password: '123456'
            });

        expect(response.status).toBe(401); // Esperamos que el código de estado sea 401 (no autorizado)
        expect(response.body).toHaveProperty('message'); // Esperamos que la respuesta contenga un mensaje de error
        expect(response.body.message).toBe('Incorrect password'); // Esperamos que el mensaje de error sea "Incorrect password"
    });

});
