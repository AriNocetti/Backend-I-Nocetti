import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY, JWT_COOKIE_NAME } from '../config/jwt.config.js';

export function getTokenData(req, res, next) {
    const token = req.signedCookies?.[JWT_COOKIE_NAME];
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
            res.locals.isAuthenticated = true;
            res.locals.role = decoded.user.role;
            res.locals.user = decoded.user;
            req.user = decoded.user; // Add user to req object
            
            // Asegurarse de que el cartId esté disponible
            console.log('Token decoded user:', decoded.user);
        } catch (error) {
            console.error('Error al verificar token:', error.message);
            res.locals.isAuthenticated = false;
            res.locals.role = null;
            res.locals.user = null;
            req.user = null;
        }
    } else {
        res.locals.isAuthenticated = false;
        res.locals.role = null;
        res.locals.user = null;
        req.user = null;
    }

    next();
}

export function routeGuard(role) {
    return (req, res, next) => {
        // console.log('routeGuard', role)
        // console.log('isAuthenticated', res.locals.isAuthenticated)
        // console.log('role', res.locals.role)
        // console.log('user', res.locals.user)

        if(!role){
            return next();
        }
        if(res.locals.isAuthenticated){
            if(res?.locals?.role !== role){
                if(res?.locals?.role == 'admin'){
                    return res.redirect('/newProduct');
                }
                if(res?.locals?.role == 'user'){
                    return res.redirect('/');
                }
            }
            next();
        } else {
            return res.redirect('/login');
        }
    };
}

export function loginGuard() {
    return (req, res, next) => {
        if (res.locals.isAuthenticated) {
            const role = res.locals.role;
            if (role === 'admin') return res.redirect('/newProduct');
            if (role === 'user') return res.redirect('/');
        }
        next();
    };
}

export function isAdmin(req, res, next) {
    if (res.locals.isAuthenticated && res.locals.role === 'admin') {
        next();
    } else {
        res.status(403).json({ status: 'error', message: 'Access denied. Admin role required.' });
    }
}

export function isUser(req, res, next) {
    if (res.locals.isAuthenticated && res.locals.role === 'user') {
        next();
    } else {
        res.status(403).json({ status: 'error', message: 'Access denied. User role required.' });
    }
}