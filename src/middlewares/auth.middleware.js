import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY, JWT_COOKIE_NAME } from '../config/jwt.config.js';

export function getTokenData(req, res, next) {
    const token = req.signedCookies?.[JWT_COOKIE_NAME];
    // console.log('hay token?', token)
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
            // console.log('decoded token', decoded)
            res.locals.isAuthenticated = true;
            res.locals.role = decoded.user.role;
            res.locals.user = decoded.user;
        } catch (error) {
            console.error('Error al verificar token:', error.message);
            res.locals.isAuthenticated = false;
            res.locals.role = null;
            res.locals.user = null;
        }
    } else {
        res.locals.isAuthenticated = false;
        res.locals.role = null;
        res.locals.user = null;
    }

    next();
}

export function routeGuard(role) {
    return (req, res, next) => {
        console.log('routeGuard', role)
        console.log('isAuthenticated', res.locals.isAuthenticated)
        console.log('role', res.locals.role)
        console.log('user', res.locals.user)

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

// export function guardIfAuthenticatedIs(isAuthenticated) {
//     return (req, res, next) => {
        
//         if (res.locals.isAuthenticated === isAuthenticated) {
//             next();
//         } else {
//             if(isAuthenticated == false){
//                 if(res?.locals?.role == 'admin'){
//                     return res.redirect('/newProduct');
//                 }
//                 if(res?.locals?.role == 'user'){
//                     return res.redirect('/');
//                 }
//             } else {
//                 return res.redirect('/pamplin');
//             }
//         }
//     };
// }

export function loginGuard() {
    return (req, res, next) => {
        if (res.locals.isAuthenticated === true){
            if(res?.locals?.role == 'admin'){
                return res.redirect('/newProduct');
            }else if(res?.locals?.role == 'user'){
                return res.redirect('/');
            }
        }
        next()
    };
}