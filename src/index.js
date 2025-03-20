import express from 'express';
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';
import { hbs } from './config/handlebars.config.js';
import mongoose from 'mongoose';
import { config } from './config/config.js';
// import methodOverride from 'method-override';
// import { Server } from 'socket.io';

const app = express();

//Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());//Indicamos que ahora podemos recibir JSON al momento de recibir solicitudes
app.use(express.urlencoded({extended: true})); //Permite que se pueda enviar información también desde la URL
//Para convertir nuestra carpeta PUBLIC en recursos estáticos
app.use(express.static( __dirname + '/public'));

//Inicializamos el motor indicando app.engine('Que motor utilizaremos', el motor instanciado)
app.engine('handlebars', hbs.engine);
//Indicamos en que parte del proyecto estarán las rutas
app.set('views', __dirname + '/views'); //Es mejor utilizar rutas absolutas para evitar problemas de ruteo relativo
//Finalmente con app.set('view engine','handlebars') indicamos que el motor que ya iniciamos arriba, es el que queremos utilizar
app.set('view engine','handlebars');

//Conexión a la base de datos
await mongoose.connect(config.URL_MONGODB)
    .then( () => console.log(`Conexión realizada con exito a la base: ${config.URL_MONGODB}`) )
    .catch( error => {
        console.error("Error en la conexión ", error);
        process.exit(); //Cerrar o detener la aplicación
    })

//Para poder reescribir e interpretar el valor del campo _method en un formulario y poder hacer DELETE
// app.use(methodOverride('_method'));

const httpServer = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080")
})

app.use('/', viewsRouter); //Para generar páginas estáticas o manejar contenido semi estático 
app.use('/api/carts', cartsRouter); 
app.use('/api/products', productsRouter);

//Creamos un servidor de sockets que vive dentro de nuestro servidor HTTP
// const socketServer = new Server(httpServer);

// // export { socketServer as io}

// socketServer.on('connection', socket => {
//     console.log("Nuevo cliente conectado");
// })