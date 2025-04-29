import { Router } from 'express';
import cookieParser from 'cookie-parser';
import ProductModel from '../models/Product.js'
import CartModel from '../models/Cart.js';
import { routeGuard, loginGuard, getTokenData } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(cookieParser());
router.use(getTokenData);

router.get('/', routeGuard('user'), async (req, res) => {
    try {
        const { category, status, sort, page = 1, limit = 10 } = req.query;

        let cartId = req.cookies.cartId;
        
        // Construir los filtros
        const filters = {
            category,
            status,
            sort,
            page,
            limit
        };

        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status === 'true';

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        // Obtener productos con paginación
        const products = await ProductModel.paginate(filter, options);

        // Pasar los productos y los filtros a la vista
        res.render('products', {
            title: 'Inicio',
            info: products,
            filters: filters, // Pasar los filtros actuales a la vista
            cartId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/realtimeproducts', routeGuard(), async (req, res) => {
    try {
        const response = await fetch("http://localhost:8080/api/products")
        const productos = await response.json();
        res.render('realTimeProducts', { title: 'Inicio', productos });
    } catch (error){
        console.error("Error obteniendo productos:", error);
        res.render('error', { title: 'Inicio', error , page: "realTimeProducts", pageName: "Productos en tiempo real"});
    }
});

// Obtener o crear un carrito
router.get('/cart', routeGuard('user'), async (req, res) => {
    try {
        let cartId = req.cookies.cartId;
        // console.log('/cart', req.cookies.cartId)

        if (!cartId) { //|| !mongoose.Types.ObjectId.isValid(cartId)
            // Crear un nuevo carrito si no existe
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            res.cookie('cartId', newCart._id.toString(), { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
            // console.log(newCart._id, 'new cart id is');
            return res.redirect(`/cart/${newCart._id}`);
        }

        // console.log(cartId, 'id');
        return res.redirect(`/cart/${cartId}`);
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        res.render('error', { title: 'Inicio', error, page: "cart", pageName: "Cart" });
    }
});

// Obtener productos de un carrito o crear uno si no hay :cid
router.get('/cart/:cid?', routeGuard('user'), async (req, res) => {
    try {
        // console.log('pasa por cid', req.params.cid , req.cookies.cartId);
        let cartId = req.params.cid || req.cookies.cartId;

        if (!cartId) { // || !mongoose.Types.ObjectId.isValid(cartId)
            // Crear un nuevo carrito si no existe
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            res.cookie('cartId', newCart._id.toString(), { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.redirect(`/cart/${newCart._id}`);
        }

        // Obtener el carrito desde la base de datos
        const cart = await CartModel.findById(cartId).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        res.render('cart', { title: 'Carrito', cart });
    } catch (error) {
        console.error("Error obteniendo carrito:", error);
        res.render('error', { title: 'Error', error, page: "cart", pageName: "Carrito" });
    }
});

router.get('/newProduct', routeGuard('admin'), async (req, res) => {
    try {
        const response = await fetch("http://localhost:8080/api/products")
        const productos = await response.json();
        res.render('newProduct', { title: 'Inicio'});
    } catch (error){
        console.error("Error obteniendo productos:", error);
        res.render('error', { title: 'Inicio', error , page: "newProduct", pageName: "Crear producto", role: req.locals.role, isAuthenticate: req.locals.isAuthenticated});
    }
});


// Rutas de autenticación
router.get('/login', loginGuard(), (req, res) => {
    res.render('auth', { title: 'Login / Registro' });
});

router.get('/profile', routeGuard(), (req, res) => {
    res.render('profile', { 
        title: 'Perfil',
        user: res.locals.user, role: res.locals.role, isAuthenticated: res.locals.isAuthenticated
    });
});

export default router;