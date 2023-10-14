import { ticketServices } from "../services/index.js"



export const createTicket = async (req, res) => {
    const ticket = {
        amount: req.body.amount,
        purchaser: req.body.purchaser
    }
    try {
        await ticketServices.createTickets(ticket);
        res.status(200).send({succes: true, message: "ticket creado con exito"})
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(404).send({succes: false, message: error.message})
    }
}