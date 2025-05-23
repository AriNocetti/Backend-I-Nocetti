import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TicketDAO {
    constructor() {
        this.path = path.join(__dirname, '../../../data/tickets.json');
        this.createFileIfNotExists();
    }

    async createFileIfNotExists() {
        try {
            await fs.access(this.path);
        } catch {
            await fs.writeFile(this.path, '[]');
        }
    }

    async getAll() {
        const data = await fs.readFile(this.path, 'utf8');
        return JSON.parse(data);
    }

    async getById(id) {
        const tickets = await this.getAll();
        return tickets.find(ticket => ticket._id === id);
    }

    async create(data) {
        const tickets = await this.getAll();
        const newTicket = {
            _id: Date.now().toString(),
            ...data,
            createdAt: new Date()
        };
        tickets.push(newTicket);
        await fs.writeFile(this.path, JSON.stringify(tickets, null, 2));
        return newTicket;
    }
}

export default TicketDAO;
