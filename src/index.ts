import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

// Configurar dotenv, lo ponemos justo al principio ya que en pruebas que hemos realizado 
//hemos detectado que si no se pone al principio hay archivos que no pueden acceder a las variables de entorno
dotenv.config(); 

import mongoose from "mongoose";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import "./types/express.definitions";

// Crear la aplicación de Express
export const app: Application = express();

// Configuración avanzada de CORS
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:4200", // Permitir solo este dominio
  methods: "GET,POST, PUT, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"], // Permitir solo ciertos encabezados
};

// Middleware para parsear JSON
app.use(express.json());

// Habilitar CORS para todas las rutas y orígenes
app.use(cors(corsOptions));

// Conectar a MongoDB
const mongoUri: string = process.env.MONGO_URI || "";
mongoose.connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Se definen rutas de prueba para comprobar que el servidor está funcionando
app.get("/", (req, res) => {
  res.send("Server running!");
});

app.use("/api/auth", authRouter); // Usar el router de autenticación
app.use("/api/users", userRouter); // Usar el router de usuarios


// Iniciamos el servidor
const port = process.env.PORT || 3000;
export const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
