import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY, JWT_COOKIE_NAME } from '../config/jwt.config.js';
import UserDTO from '../dto/user.dto.js';
import authService from '../services/auth.service.js';
import cartService from '../services/cart.service.js';

const router = Router();

// Ruta para iniciar la autenticación con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'read:user', 'user'] }));

// Callback de GitHub
router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Autenticación exitosa
        req.session.user = {
            id: req.user._id,
            email: req.user.email,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            role: req.user.role
        };
        res.redirect('/profile');
    }
);

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    res.clearCookie(JWT_COOKIE_NAME);
    res.redirect('/login');
    // req.session.destroy(err => {
    //     console.log('Resultado destroy:', err);
    //     if (err) {
    //         return res.status(500).json({ error: 'Error al cerrar sesión' });
    //     }

    //     res.clearCookie('connect.sid');
    //     res.redirect('/login');
    // });
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, age } = req.body;

        // Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({ status: 'error', error: 'Faltan campos obligatorios' });
        }

        // Verificar si el usuario ya existe
        const exists = await authService.getUserByEmail(email);
        if (exists) {
            return res.status(400).json({ status: 'error', error: 'El usuario ya existe' });
        }

        // Crear un nuevo carrito para el usuario
        const newCart = await cartService.createCart();

        // Crear el usuario
        const user = await authService.createUser({
            first_name,
            last_name,
            email,
            password,
            age,
            role: 'user',
            cart: newCart._id
        });

        // res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente' })
        res.redirect('/login');
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({ status: 'error', error: 'Faltan campos obligatorios' });
        }

        // Validar usuario y contraseña
        const user = await authService.validateUser(email, password);
        if (!user) {
            return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });
        }

        // Crear JWT
        const userToToken = {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            cart: user.cart // Incluir el cartId en el token
        };

        const token = jwt.sign({ user: userToToken }, JWT_PRIVATE_KEY, { expiresIn: '24h' });

        // Enviar token en cookie
        res.cookie(JWT_COOKIE_NAME, token, {
            httpOnly: true,
            signed: true,
            maxAge: 86400000 // 24 horas
        });

        // res.json({ status: 'success', message: 'Login exitoso' });
        res.redirect('/');
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Current - Obtener usuario actual
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    const userDTO = new UserDTO(res.locals.user);
    res.json({ status: 'success', payload: userDTO });
});

export default router;
