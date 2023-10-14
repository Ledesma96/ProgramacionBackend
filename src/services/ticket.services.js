export default class TikcetRepository {
    constructor(dao) {
        this.dao = dao;
    }

    createTickets = async(ticket) => {
        return await this.dao.createTickets(ticket)
    }
}