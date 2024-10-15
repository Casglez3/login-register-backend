import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

//Definir la interfaz para el documento de usuario
interface IUser extends Document {
    userName: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
}


//Definir el esquema de Mongoose para el usuario
const UserSchema = new Schema<IUser>({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
});


// Hash la contraseña antes de guardar
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Middleware para encriptar la contraseña antes de actualizar
UserSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as { password?: string };

    // Verificar si se está modificando la contraseña
    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
        this.setUpdate(update);
    }

    next();
});

// Método para comparar la contraseña ingresada con la almacenada
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};


// Sobrescribimos el método toJSON para eliminar la contraseña de las respuestas JSON
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;  // Eliminar la contraseña antes de devolver el objeto
    return obj;
};


//Definir el modelo de Mongoose para el usuario
const User = model<IUser>("User", UserSchema);

//Creamos los métodos que interactuan con la base de datos
export const createUser = async (userName: string, password: string) => {
    const user = new User({ userName, password });
    await user.save();
    return user;
}

export const findOneUser = async (userName: string) => {
    return await User.findOne({ userName });
}

export const findOneUserById = async (id: string) => {
    return await User.findById(id);
}

export const updateUserById = async (id: string, userName: string, password: string) => {
    await User
        .findByIdAndUpdate(id, { userName, password });
}

export const deleteUserById = async (id: string) => {
    await User.findByIdAndDelete(id);
}

export default User;
