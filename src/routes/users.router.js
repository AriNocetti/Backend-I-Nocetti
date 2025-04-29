import { Router } from 'express';
import UserModel from '../models/user.model.js';

const router = Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
        res.json({ status: 'success', payload: users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Obtener un usuario por ID
router.get('/:uid', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.uid).select('-password');
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
        }
        res.json({ status: 'success', payload: user });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

export default router;
