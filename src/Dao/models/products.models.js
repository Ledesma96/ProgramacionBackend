import mongoose from "mongoose";

const productsCollections = "products"

const productsSchema = new mongoose.Schema({
    title: String,
    thumbnail: String,
    code: Number,
    stock: Number,
    price: Number,
    description: String,
    status:Boolean,
})

const productsModel = mongoose.model(productsCollections, productsSchema)

export default productsModel