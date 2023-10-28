import { productsServices } from "../services/index.js";
import assert from "assert";
import mongoose from "mongoose";
import "dotenv/config.js";

describe('Testing products dao', function() {
    
    before(function (done) {
        this.timeout(8000); // Aumenta el tiempo límite a 8000 ms
        mongoose.connect(process.env.URL_MONGO, {
            dbName: "ecommerce"
        })
        .then(() => {
            console.log("DB connected!!");
            done(); 
        })
        .catch(done); 
    });
    
    describe('Run', function(){
        this.timeout(10000)
        it('El dao debe poder obtener una lista de todos los productos', async function() {
            const result = await productsServices.getAllProducts();
            assert.strictEqual(Array.isArray(result), true);
        });
    });
});
