import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollections = "products"

const productsSchema = new mongoose.Schema({
    title: String,
    thumbnail: String,
    code: Number,
    stock: Number,
    price: Number,
    description: String,
    status:Boolean,
    category: String,
    owner: {type: String, default: 'admin'},
})

productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollections, productsSchema)

export default productsModel