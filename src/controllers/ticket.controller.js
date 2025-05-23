import ticketService from '../services/ticket.service.js';
import mongoose from 'mongoose';

class TicketController {
    async createTicket(req, res) {
        try {
            const purchaser = req.user?.email;
            const { cart } = req;

            const result = await ticketService.createTicket(purchaser, cart);
            
            if (result.ticket) {
                res.status(201).json({
                    status: 'success',
                    ticket: result.ticket,
                    failedProducts: result.failedProducts
                });
            } else {
                res.status(400).json({
                    status: 'error',
                    message: 'No se pudo procesar ningún producto',
                    failedProducts: result.failedProducts
                });
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getTicketById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID de ticket inválido'
                });
            }
            const ticket = await ticketService.getTicketById(id);
            res.json({
                status: 'success',
                data: ticket
            });
        } catch (error) {
            res.status(error.message.includes('no encontrado') ? 404 : 500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getTicketByCode(req, res) {
        try {
            const ticket = await ticketService.getTicketByCode(req.params.code);
            res.json({
                status: 'success',
                data: ticket
            });
        } catch (error) {
            res.status(error.message.includes('no encontrado') ? 404 : 500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getTicketsByPurchaser(req, res) {
        try {
            const email = req.user?.email;
            if (!email) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Usuario no autenticado'
                });
            }

            const tickets = await ticketService.getTicketsByPurchaser(email);
            res.json({
                status: 'success',
                data: tickets
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

export default new TicketController();
