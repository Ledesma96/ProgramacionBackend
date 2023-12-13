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
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    rol: {
        type: String,
        enum: ["admin", "usuario", "premium"],
        default: "usuario"
    },
    documents: {
        name: String,
        reference: String,
    },
    last_connection: Date,
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;