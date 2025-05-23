import { PersistenceFactory } from '../DAO/factory.js';
import { CreateTicketDTO } from '../dto/ticket.dto.js';

class TicketRepository {
    constructor() {
        const { TicketDAO } = PersistenceFactory.getPersistence();
        this.dao = new TicketDAO();
    }
    async createTicket(ticketData) {
        const ticketDTO = new CreateTicketDTO(ticketData);
        return await this.dao.createTicket(ticketDTO);
    }

    async getTicketById(id) {
        return await this.dao.getTicketById(id);
    }

    async getTicketByCode(code) {
        return await this.dao.getTicketByCode(code);
    }

    async getTicketsByPurchaser(email) {
        return await this.dao.getTicketsByPurchaser(email);
    }
}

export default new TicketRepository();
