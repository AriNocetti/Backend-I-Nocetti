import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { config } from './config.js';
import { JWT_PRIVATE_KEY, JWT_COOKIE_NAME } from './jwt.config.js';
import authService from '../services/auth.service.js';

// Extractor de cookie para JWT
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies[JWT_COOKIE_NAME];
    }
    return token;
};
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Estrategia JWT
passport.use('current', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_PRIVATE_KEY
}, async (jwt_payload, done) => {
    try {  
        console.log(jwt_payload);
        return done(null, jwt_payload.user);
    } catch (error) {
        console.log(error);
        return done(error);
    }
}));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await authService.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

passport.use('github', new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log('Profile from GitHub:', profile);

        try {
            // Intentar obtener el email real primero
            let userEmail = profile.emails?.[0]?.value || profile._json.email;
            
            // Si no hay email disponible, generar uno con el username
            if (!userEmail) {
                userEmail = `${profile.username}@github.com`;
                console.log('Email no disponible, usando generado:', userEmail);
            } else {
                console.log('Usando email de GitHub:', userEmail);
            }

            // Buscar si existe un usuario con ese email
            let user = await authService.getUserByEmail(userEmail);

            if (!user) {
                // Si no existe, crear un nuevo usuario
                let newUser = {
                    first_name: profile._json.name || profile.username,
                    last_name: '',
                    email: userEmail,
                    age: 18,
                    password: '',
                    role: 'user'
                };
                console.log('Creando nuevo usuario:', newUser);
                user = await authService.createUser(newUser);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    } catch (error) {
        return done(error);
    }
}));
