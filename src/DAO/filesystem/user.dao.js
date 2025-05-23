import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserDAO {
    constructor() {
        this.path = path.join(__dirname, '../../../data/users.json');
        this.createFileIfNotExists();
    }

    async createFileIfNotExists() {
        try {
            // Asegurar que el directorio data existe
            const dataDir = path.dirname(this.path);
            try {
                await fs.access(dataDir);
            } catch {
                await fs.mkdir(dataDir, { recursive: true });
            }
            
            // Verificar si el archivo existe
            await fs.access(this.path);
        } catch {
            // Crear el archivo con un usuario admin por defecto
            const defaultAdmin = {
                _id: Date.now().toString(),
                first_name: 'Admin',
                last_name: 'Coder',
                email: 'adminCoder@coder.com',
                password: '$2b$10$XjZ3QU5c0CwVYk0qMxPp7OiZiKmqMwm7F1ZUXkR.yQHgJ9g4BpE6G', // adminCod3r123
                role: 'admin'
            };
            await fs.writeFile(this.path, JSON.stringify([defaultAdmin], null, 2));
        }
    }

    async getAll() {
        const data = await fs.readFile(this.path, 'utf8');
        return JSON.parse(data);
    }

    async getById(id) {
        const users = await this.getAll();
        return users.find(user => user._id === id);
    }

    async getByEmail(email) {
        const users = await this.getAll();
        return users.find(user => user.email === email);
    }

    async validateUser(email, password) {
        const user = await this.getByEmail(email);
        if (!user) return null;
        
        // En un caso real, aquí verificaríamos el hash de la contraseña
        // Por ahora, para testing, hacemos una comparación directa
        if (user.password === password) {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    async create(data) {
        const users = await this.getAll();
        const newUser = {
            _id: Date.now().toString(),
            ...data
        };
        users.push(newUser);
        await fs.writeFile(this.path, JSON.stringify(users, null, 2));
        return newUser;
    }

    async update(id, data) {
        let users = await this.getAll();
        const index = users.findIndex(user => user._id === id);
        if (index === -1) return null;
        users[index] = { ...users[index], ...data };
        await fs.writeFile(this.path, JSON.stringify(users, null, 2));
        return users[index];
    }
}

export default UserDAO;
