# README

Este es un proyecto de ejemplo creado con Node.js y Express. También hemos creado un frontend de ejemplo que se puede encontrar con su propio README.md en el siguiente repositorio: https://github.com/Casglez3/login-register-frontend.git

## Características principales:

Autenticación de usuarios mediante login y registro.

CRUD (Crear, Leer, Actualizar y Eliminar) de usuarios.

Validación de contraseñas fuertes.

Protección de rutas con autenticación basada en JWT.

Pruebas unitarias con Jest y Supertest.

MongoDB como base de datos para persistencia de usuarios.

## Tecnologías utilizadas:

**Node.js**

**Express.js**

**MongoDB**

**Mongoose (para la modelación de datos)**

**JWT** (para la autenticación y manejo de tokens)

**Jest** (para pruebas)

**Supertest** (para pruebas de endpoints)

## Requisitos:

**Node.js v14 o superior**

**MongoDB** (local o en la nube)

**npm o yarn**

## Configuración del entorno:
Antes de ejecutar el proyecto, necesitas configurar las variables de entorno. Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

PORT=3000

MONGO_URI=mongodb://localhost:27017/login-register

JWT_SECRET=your_jwt_secret

FRONTEND_ORIGIN=http://localhost:4200

**Variables importantes:**
PORT: El puerto donde se ejecutará la aplicación.

MONGO_URI: La URL de conexión a la base de datos MongoDB.

JWT_SECRET: La clave secreta usada para firmar los tokens JWT.

FRONTEND_ORIGIN: Origen permitido para el CORS.

## Instalación:

Clona el repositorio:

git clone https://github.com/Casglez3/login-register-backend.git

`cd proyecto-autenticacion`

Instala las dependencias:

`npm install`

Asegúrate de que MongoDB esté corriendo en la ruta indicada en la variale MONGO_URI, ya sea localmente o conectado a una instancia en la nube.

**Ejecuta el servidor en modo desarrollo:**

`npm run dev`

La API estará disponible en http://localhost:3000 o en el puerto que hayas configurado.

## Rutas disponibles

**-Autenticación (Rutas de /api/auth)**

**Registro (POST /register):** Crea una nueva cuenta de usuario.

Body (JSON):

`{`

`  "userName": "testUser",`

 ` "password": "YourPassword123!"`

`}`

Respuestas:

201: Usuario registrado exitosamente.

400: Si el nombre de usuario ya existe o la contraseña no es válida.

**Login (POST /login):** Inicia sesión con las credenciales del usuario.

Body (JSON):

`{`

 ` "userName": "testUser",`

 ` "password": "YourPassword123!"`

`}`

Respuestas:

200: Retorna un token JWT si las credenciales son válidas.

401: Si la contraseña es incorrecta.

404: Si el usuario no existe.

**-Usuarios (Rutas de /api/users)**

**Obtener usuario por ID (GET /:id):** Devuelve la información de un usuario existente.

Se necesita un token JWT en el encabezado Authorization.

**Actualizar usuario (PUT /:id):** Actualiza los datos de un usuario (requiere autenticación).

Body (JSON):

`{`

 ` "userName": "newUserName",`

`  "password": "NewPassword123!"`

`}`

**Eliminar usuario (DELETE /:id):** Elimina un usuario existente (requiere autenticación).

## Pruebas

Para ejecutar las pruebas, utiliza el siguiente comando:

`npm test `

Esto ejecutará las pruebas definidas en los archivos de test ubicados en el directorio tests/.

**Cobertura de pruebas:**

Registro de usuario: Pruebas para crear usuarios nuevos y verificar contraseñas inválidas.

Inicio de sesión: Pruebas para validar el login con credenciales correctas e incorrectas.

Gestión de usuarios: Pruebas para obtener, actualizar y eliminar usuarios.


## En cuanto a la organización general de la aplicación y las decisiones tomadas podemos destacar:
**Controladores:** Los controladores (authController.ts y userController.ts) son responsables de manejar la lógica de negocio. Cada controlador gestiona las solicitudes relacionadas con la autenticación de usuarios y la gestión de datos de usuario, separando las responsabilidades y promoviendo la claridad en el código.

**Modelos:** El modelo de usuario (user.ts) está definido con Mongoose, lo que permite la interacción con la base de datos. Incluye validaciones de esquema y métodos para gestionar la autenticación y la comparación de contraseñas, así como la lógica para encriptar las contraseñas utilizando bcrypt.

**Rutas:** Las rutas (authRoutes.ts y userRoutes.ts) están organizadas para manejar las solicitudes HTTP. Las rutas de autenticación permiten el registro y el inicio de sesión, mientras que las rutas de usuario manejan la recuperación, actualización y eliminación de datos de usuario. El middleware de autenticación se aplica a las rutas de usuario para protegerlas de accesos no autorizados.

**Validaciones de contraseña:** Se implementan validaciones en el registro y actualización de usuarios, asegurando que las contraseñas cumplan con criterios de seguridad específicos (como longitud y complejidad). Esto se realiza mediante expresiones regulares en el código.

**Tipos personalizados:** En la carpeta types, se encuentran las definiciones de tipos personalizadas, como se ve en el archivo express.definition.ts. Este archivo extiende la interfaz Request de Express para añadir una propiedad user, que contiene la información del usuario autenticado. Esta práctica mejora la autocompletación, la seguridad de tipos y la claridad del código. Al especificar tipos como JwtPayload, se asegura que cualquier acceso a req.user sea seguro y esté tipado correctamente.

**Pruebas unitarias:** Las pruebas unitarias se llevan a cabo utilizando Jest y Supertest, garantizando que las funcionalidades críticas de la API se comporten correctamente y se mantengan a lo largo del tiempo.













