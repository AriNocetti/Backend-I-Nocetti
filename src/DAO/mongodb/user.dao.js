import userModel from '../../models/user.model.js';
import bcrypt from 'bcrypt';

export default class UserDAO {
    async createUser(userData) {
        return await userModel.create(userData);
    }

    async getUserById(id) {
        return await userModel.findById(id).populate('cart');
    }

    async getUserByEmail(email) {
        return await userModel.findOne({ email }).populate('cart');
    }

    async updateUser(id, userData) {
        return await userModel.findByIdAndUpdate(id, userData, { new: true });
    }

    async deleteUser(id) {
        return await userModel.findByIdAndDelete(id);
    }

    async validateUser(email, password) {
        try {
            // Buscar el usuario por email
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }

            // Verificar la contraseña
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error('Invalid password');
            }

            return user;
        } catch (error) {
            console.error('Error validating user:', error);
            throw error;
        }
    }
}
