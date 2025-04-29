import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import viewsRouter from './routes/views.router.js';
import usersRouter from './routes/users.router.js';
import sessionsRouter from './routes/sessions.router.js';
import __dirname from './utils.js';
import { hbs } from './config/handlebars.config.js';
import mongoose from 'mongoose';
import { config } from './config/config.js';
import './config/passport.config.js';
import cookieParser from 'cookie-parser';
import { JWT_PRIVATE_KEY } from './config/jwt.config.js';
import { getTokenData } from './middlewares/auth.middleware.js';

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(JWT_PRIVATE_KEY));
app.use(express.static(__dirname + '/public'));

// Configuración de Handlebars
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Configuración de sesión
app.use(session({
    secret: 'coderSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Conexión a MongoDB
const startServer = async () => {
    try {
        await mongoose.connect(config.URL_MONGODB);
        console.log(`Conexión realizada con éxito a la base: ${config.URL_MONGODB}`);
        
        // Iniciar servidor
        const httpServer = app.listen(config.PORT, () => {
            console.log(`Servidor escuchando en el puerto ${config.PORT}`);
        });
    } catch (error) {
        console.error('Error en la conexión:', error);
        process.exit(1);
    }
};

// Rutas
app.use(getTokenData);
app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

// Iniciar servidor
startServer();
