import { PersistenceFactory } from '../DAO/factory.js';

class AuthService {
    constructor() {
        const { UserDAO } = PersistenceFactory.getPersistence();
        this.userDAO = new UserDAO();
    }

    async validateUser(email, password) {
        return await this.userDAO.validateUser(email, password);
    }

    async getUserByEmail(email) {
        return await this.userDAO.getByEmail(email);
    }

    async createUser(userData) {
        return await this.userDAO.create(userData);
    }

    async getUserById(id) {
        return await this.userDAO.getById(id);
    }
}

export default new AuthService();
