import express from 'express';
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';
import { hbs } from './config/handlebars.config.js';
import { Server } from 'socket.io';

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

const httpServer = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080")
})
//Creamos un servidor de sockets que vive dentro de nuestro servidor HTTP
const socketServer = new Server(httpServer);

// export { socketServer as io}

app.use('/', viewsRouter); //Para generar páginas estáticas o manejar contenido semi estático 
app.use('/api/carts', cartsRouter); 
app.use('/api/products', productsRouter(socketServer));

socketServer.on('connection', socket => { //Cuando un cliente se conecta al sevidor, dispara el evento 'connection'
    console.log("Nuevo cliente conectado");
    /**
     * socket.on("nombre del evento a escuchar o subscribirse, callback con la data enviada")
     */
    // socket.on('message', data => {
    //     console.log(data);
    // })

    //socket.emit: envía un mensaje a un socket específico (el actual)
    // socket.emit('evento_para_socket_individual', "Este mensaje solo lo debe recibir el socket");
    // //socket.broadcast.emit: envía un mensaje a todos los sockets excepto el que lo emitió
    // socket.broadcast.emit('evento_para_todos_menos_el_socket_actual', "Este evento los verán todos los sockets conectados menos el socket actual");
    // //socketServer.emit: envía un mensaje a todos los sockets conectados al servidor
    // socketServer.emit('evento_para_todos', 'este mensaje lo reciben todos los sockets conectados');

    // /** Ejercicio para enviar mensajes */
    // //Cada vez que alguien se conecte, le voy a tener que enviar los mensajes
    // socket.emit('loadMessages', messages);

    // //Cada vez que alguien se conecta, quiero avisar al resto de los usuarios
    // socket.broadcast.emit('newUser', socket.id);

    // socket.on('newMessage', message => {
    //     const newMessage = `${socket.id} : ${message}`;
    //     messages.push(newMessage);
    //     console.log(messages);
    //     socketServer.emit('newMessage', newMessage);
    // })

})