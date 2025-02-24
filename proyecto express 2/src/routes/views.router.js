import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const response = await fetch("http://localhost:8080/api/products")
        const productos = await response.json();
        res.render('home', { title: 'Inicio', productos });
    } catch (error){
        console.error("Error obteniendo productos:", error);
        res.render('home', { title: 'Inicio', productos: [], error });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const response = await fetch("http://localhost:8080/api/products")
        const productos = await response.json();
        res.render('realTimeProducts', { title: 'Inicio', productos });
    } catch (error){
        console.error("Error obteniendo productos:", error);
        res.render('realTimeProducts', { title: 'Inicio', productos: [], error });
    }
});


export default router;