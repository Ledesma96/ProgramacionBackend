export default class Ticket{
    constructor(){
        this.id = 1 ,
        this.tickets = []
    }

    getTickets = async () => {
        try {
            return this.tickets
        } catch (error) {
            return {succes: false, message: error.message}
        }
    }

    getTicketsById = async (id) => {
        try {
            const tickets = await this.tickets.find(t => t.id === id)
            return tickets
        } catch (error) {
            return {succes: false, message: error.message}
        }
    }
    createTickets = async (ticket) => {
        const tickets = this.tickets
        const codeOne = tickets.length
        const nextCode = codeOne? codeOne + 1 : 1
        const purchase_datetime = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
        try {
            this.tickets.push({...ticket, code : nextCode, purchase_datetime: purchase_datetime})
            return ticket
        } catch (error) {
            return {succes: false, message: error.message}
        }
    }
}