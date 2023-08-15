import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    password: String,
    email: 
    { type: String,
    unique:true},
    rol: {
        type: String,
        enum: ["admin", "usuario"],
        default: "usuario"
    }
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;