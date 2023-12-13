import Stripe from "stripe"
import 'dotenv/config.js'
import cartModel from "../Dao/mongo/models/cart.model.js"

const stripe = new Stripe('sk_test_51OHnm5DZBMmoG22QqcpX9I4ix1335WxJbvPtnhhG2uiuL1E1xhNb5sNmqnDg0KBsHMBnQcVRZM2DJyt8Z3UVCwnW00fupHv7BJ')

export const StripePayment = async (req, res) => {
    const cartId = req.body.cart
    const cart = await cartModel.findById(cartId).populate("products.pid")

    const lineItems = cart.products.map((producto) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: producto.pid.title,
            description: producto.pid.description,
          },
          unit_amount: producto.pid.price,
        },
        quantity: producto.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: 'https://localhost:8080/',
        cancel_url: 'https://localhost:8080/error'
    });

    return res.json(session);
}

