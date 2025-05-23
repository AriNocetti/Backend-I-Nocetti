export function authorizeRole(...allowedRoles) {
    return (res, next) => {
        const user = res.locals.user;
        if(!user){
            return res.status(401).json({ message: 'No se han encontrado las credenciales del usuario' });
        }
        if(!user.role){
            return res.status(401).json({ message: 'No se ha encontrado el rol del usuario' });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
        }
        next();
    };
}