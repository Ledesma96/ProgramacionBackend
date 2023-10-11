import fs from 'fs';

export default class TicketsManager {
    constructor(){
        if (!fs.existsSync("./tickets.json")){
            fs.writeFileSync("./tickets.json", JSON.stringify([]));
        }
        this.path = './tickets.json';
    }

    
    getTickets= async() => {
        try {
            const contents = await fs.readFileSync(this.path, "utf-8")
            return JSON.parse(contents);
        } catch (error) {
            return {succes: false, error: error.message}
        }
    }
    
    getTicketsById= async(id) => {
        try {
            const tickets = await this.getTickets();
            return tickets.find(ticket => ticket.id === id);
        } catch (error) {
            return {succes: false, error: error.message}
        }
    }


    createTickets = async ( ticket ) => {
        const tickets = await this.createTickets();
        const codeOne = await tickets.length;
        const nextCode = codeOne ? codeOne + 1 : 1;
        const purchase_datetime = new Date().toLocalString('es-AR', {timeZone: 'America/Argentina/Buenos_Aires'});
        try {
            const newTickets = new TicketsManager({...ticket, code : nextCode, purchase_datetime: purchase_datetime})
            tickets.push(newTickets);
            await fs.promises.writeFileSync(this.path, JSON.stringify(tickets));
            return {succes: true, message: "Ticket creado con exito"}
        } catch (error) {
            return {succes: false, message: error.message}
        }
    }
}