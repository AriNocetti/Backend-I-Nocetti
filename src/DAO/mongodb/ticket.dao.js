import ticketModel from '../../models/Ticket.model.js';
import { TicketDTO } from '../../dto/ticket.dto.js';

export default class TicketDAO {
    async createTicket(ticketData) {
        const ticket = await ticketModel.create(ticketData);
        return new TicketDTO(ticket);
    }

    async getTicketById(id) {
        const ticket = await ticketModel.findById(id).populate('products.product');
        return ticket ? new TicketDTO(ticket) : null;
    }

    async getTicketByCode(code) {
        const ticket = await ticketModel.findOne({ code }).populate('products.product');
        return ticket ? new TicketDTO(ticket) : null;
    }

    async getTicketsByPurchaser(email) {
        const tickets = await ticketModel.find({ purchaser: email })
            .populate('products.product')
            .sort({ purchase_datetime: -1 });
        return tickets.map(ticket => new TicketDTO(ticket));
    }
}
