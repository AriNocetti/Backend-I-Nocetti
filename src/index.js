import express from 'express';
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';
import { hbs } from './config/handlebars.config.js';

const app = express();

//Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());//Indicamos que ahora podemos recibir JSON al momento de recibir solicitudes
app.use(express.urlencoded({extended: true})); //Permite que se pueda enviar información también desde la URL

app.engine('handlebars', hbs.engine);

//Inicializamos el motor indicando app.engine('Que motor utilizaremos', el motor instanciado)
app.engine('handlebars', hbs.engine);
//Indicamos en que parte del proyecto estarán las rutas
app.set('views', __dirname + '/views'); //Es mejor utilizar rutas absolutas para evitar problemas de ruteo relativo
//Finalmente con app.set('view engine','handlebars') indicamos que el motor que ya iniciamos arriba, es el que queremos utilizar
app.set('view engine','handlebars');

app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080")
})

app.use('/', viewsRouter); //Para generar páginas estáticas o manejar contenido semi estático 
app.use('/api/carts', cartsRouter); 
app.use('/api/products', productsRouter);

//Para convertir nuestra carpeta PUBLIC en recursos estáticos
app.use(express.static( __dirname + '/public'));