import mongoose from "mongoose";
import User from "../src/models/users";
import request from 'supertest';
import { app, server } from '../src/index';

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
        await User.deleteMany({ userName: { $in: ['testUser', 'testUserUpdated'] } }); 
    });


    //PRUEBAS DE OBTECION DE UN USUARIO EXISTENTE
    it('You must return a user correctly', async () => {
        const user = await User.create({
            userName: 'testUser', password: 'Prueba123!'
        });
        const response = await request(app)
            .get(`/api/users/${user._id}`);
        expect(response.status).toBe(200); // Esperamos que el código de estado sea 200 (OK)
        expect(response.body).toHaveProperty('_id'); // Esperamos que la respuesta contenga el ID del usuario
        expect(response.body.userName).toBe('testUser'); // El nombre de usuario debe ser "testUser"
    }
    );
    

    //PRUEBAS DE ACTUALIZACION DE UN USUARIO EXISTENTE
    it('You must update a user correctly', async () => {
        const user = await User.create({
            userName: 'testUser', password: 'Prueba123!'
        });
        const response = await request(app)
            .put(`/api/users/${user._id}`)
            .send({ userName: 'testUserUpdated', password: 'Prueba1234!' });
        expect(response.status).toBe(200); // Esperamos que el código de estado sea 200 (OK)
        expect(response.body.message).toBe('User updated successfully'); // Esperamos que el mensaje sea "User updated successfully"
    }
    );

    //Prueba de actualización de usuario con una contraseña no válida
    it('You must return an error when trying to update a user with an invalid password', async () => {
        const user = await User.create({
            userName: 'testUser', password: 'Prueba123!'
        });
        const response = await request(app)
            .put(`/api/users/${user._id}`)
            .send({ userName: 'testUser', password: '1234' });
        expect(response.status).toBe(400); // Esperamos que el código de estado sea 400 (solicitud incorrecta)
        expect(response.body).toHaveProperty('message'); // Esperamos que la respuesta contenga un mensaje de error
        expect(response.body.message).toBe('password must contain at least one lowercase letter, one uppercase letter, one number and one special character'); // Esperamos que el mensaje de error sea "password must contain at least one lowercase letter, one uppercase letter, one number and one special character"
    }
    );


     //PRUEBAS DE ELIMINAR UN USUARIO EXISTENTE
     it('You must delete a user correctly', async () => {
        const user = await User.create({
            userName: 'testUser', password: 'Prueba123!'
        });
        const response = await request(app)
            .delete(`/api/users/${user._id}`);
        expect(response.status).toBe(200); // Esperamos que el código de estado sea 200 (OK)
        expect(response.body.message).toBe('User deleted successfully'); // Esperamos que el mensaje sea "User deleted successfully"
    }
    );

    // Prueba de eliminación de usuario con un ID no válido
    it('You must return an error when trying to delete a user with an invalid ID', async () => {
        const response = await request(app)
            .delete('/api/users/1234');
        expect(response.status).toBe(500); // Esperamos que el código de estado sea 500 (error interno del servidor)
        expect(response.body).toHaveProperty('message'); // Esperamos que la respuesta contenga un mensaje de error
        expect(response.body.message).toBe('Error when deleting the user'); // Esperamos que el mensaje de error sea "Error when deleting the user"
    }
    );

});
