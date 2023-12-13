import Stripe from "stripe"
import 'dotenv/config.js'
import cartModel from "../Dao/mongo/models/cart.model.js"

const stripe = new Stripe(process.env.PRIVATE_KEY_STRIPE)

function buildUrl(path) {
  if (process.env.NODE_ENV === 'production') {
    
    return `https://programacionbackend-production-a757.up.railway.app${path}`;
  } else {
   
    return `http://localhost:8080${path}`;
  }
}


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
        success_url: buildUrl('/'),
        cancel_url: buildUrl('/error')
    });

    return res.json(session);
}

