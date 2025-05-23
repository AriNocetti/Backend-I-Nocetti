import { Router } from 'express';
import ticketController from '../controllers/ticket.controller.js';
import { routeGuard } from '../middlewares/auth.middleware.js';
import mongoose from 'mongoose';

const router = Router();

// Get ticket by ID
router.get('/:id', routeGuard('user'), ticketController.getTicketById);

// Get ticket by code
router.get('/code/:code', routeGuard('user'), ticketController.getTicketByCode);

export default router;
