import { config } from '../config/config.js';
import CartDAOMongo from './mongodb/cart.dao.js';
import ProductDAOMongo from './mongodb/product.dao.js';
import TicketDAOMongo from './mongodb/ticket.dao.js';
import UserDAOMongo from './mongodb/user.dao.js';

import CartDAOFile from './filesystem/cart.dao.js';
import ProductDAOFile from './filesystem/product.dao.js';
import TicketDAOFile from './filesystem/ticket.dao.js';
import UserDAOFile from './filesystem/user.dao.js';

// Singleton for MongoDB connection
class MongoConnection {
    static #instance;
    
    constructor() {
        if (MongoConnection.#instance) {
            return MongoConnection.#instance;
        }
        MongoConnection.#instance = this;
    }

    static getInstance() {
        if (!MongoConnection.#instance) {
            MongoConnection.#instance = new MongoConnection();
        }
        return MongoConnection.#instance;
    }
}

// Factory for DAO selection
class PersistenceFactory {
    static getPersistence() {
        const persistenceType = config.PERSISTENCE || 'MONGO';
        console.log(persistenceType, 'persistenceType')
        
        switch (persistenceType.toUpperCase()) {
            case 'FILE':
                return {
                    CartDAO: CartDAOFile,
                    ProductDAO: ProductDAOFile,
                    TicketDAO: TicketDAOFile,
                    UserDAO: UserDAOFile
                };
            case 'MONGO':
            default:
                return {
                    CartDAO: CartDAOMongo,
                    ProductDAO: ProductDAOMongo,
                    TicketDAO: TicketDAOMongo,
                    UserDAO: UserDAOMongo
                };
        }
    }
}

export { MongoConnection, PersistenceFactory };
