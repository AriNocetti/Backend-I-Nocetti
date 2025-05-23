/**
 * Archivo de configuración que asume la responsabilidad de la carga de las variables de entorno
 * según el environment en el que se este ejecutando la aplicación

 */

//Importar dotenv e inicializo las variables de entorno
import dotenv from 'dotenv';

/**
 * Por defecto dotenv.config() carga el archivo .env posicionado en la carpeta raíz del proyecto,
 * es decir, donde esta el package.json
 * Si llegara el caso que no carga el archivo .env es importante indicar el path por ejemplo así:
 * dotenv.config({ path: "../.env"}); Hubo conflicto en instalaciones de otros framework
 */
dotenv.config(); //Nos permite poder trabajar con las variables de entorno

export const config = {
    PORT: process.env.PORT || 8080,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || 'defaultJWTKey',
    JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'currentUser',
    URL_MONGODB: process.env.URL_MONGO_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    PERSISTENCE: process.env.PERSISTENCE || 'MONGO'
}