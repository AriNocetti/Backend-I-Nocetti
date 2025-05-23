import productService from '../services/product.service.js';
import cartService from '../services/cart.service.js';
import ticketService from '../services/ticket.service.js';

class ViewController {
    async renderProducts(req, res) {
        try {
            const { category, status, sort, page = 1, limit = 10 } = req.query;
            
            // Si el usuario está autenticado, usar su carrito
            const user = res.locals.user || req.user;
            let cartId = user?.cart || req.cookies.cartId;

            // Si no hay cartId, crear uno nuevo
            if (!cartId) {
                console.log('Creando nuevo carrito');
                const cart = await cartService.createCart();
                cartId = cart._id;
                if (!user) {
                    res.cookie('cartId', cartId, { 
                        maxAge: 7 * 24 * 60 * 60 * 1000, 
                        httpOnly: true 
                    });
                }
            }

            console.log('Using cartId:', cartId);

            // Construir los filtros, solo incluir los que tienen valor
            const filters = {};
            if (category) filters.category = category;
            if (sort) filters.sort = sort;
            if (page) filters.page = page;
            if (limit) filters.limit = limit;
            if (status !== undefined && status !== '') filters.status = status;

            // Obtener productos con filtros
            const products = await productService.getAllProducts(filters);

            // Pasar los productos y los filtros a la vista
            res.render('products', {
                title: 'Inicio',
                info: products,
                filters: { category, status, sort, page, limit },
                cartId
            });
        } catch (error) {
            console.error('Error en renderProducts:', error);
            res.render('error', { 
                title: 'Error', 
                error: error.message, 
                page: 'products', 
                pageName: 'Productos'
            });
        }
    }

    async renderRealTimeProducts(req, res) {
        try {
            const { category, status, sort, page = 1, limit = 10 } = req.query;
            const filters = {};
            if (category) filters.category = category;
            if (sort) filters.sort = sort;
            if (page) filters.page = page;
            if (limit) filters.limit = limit;
            if (status !== undefined && status !== '') filters.status = status;

            const products = await productService.getAllProducts(filters);
            res.render('realTimeProducts', { 
                title: 'Inicio', 
                productos: products.docs || products
            });
        } catch (error) {
            console.error("Error obteniendo productos:", error);
            res.render('error', { 
                title: 'Inicio', 
                error: error.message, 
                page: "realTimeProducts", 
                pageName: "Productos en tiempo real"
            });
        }
    }

    async handleCartRedirect(req, res) {
        try {
            // Si el usuario está autenticado
            const user = res.locals.user || req.user;
            console.log('User info:', user);

            if (user?.cart) {
                console.log('Redirigiendo al carrito del usuario:', user.cart);
                // Limpiar cualquier cookie antigua de cartId
                res.clearCookie('cartId');
                return res.redirect(`/cart/${user.cart}`);
            }

            // Si no hay usuario autenticado o no tiene carrito, usar el de la cookie
            let cartId = req.cookies.cartId;
            
            // Validar si el cartId tiene formato de MongoDB
            const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(cartId);
            if (!isValidMongoId) {
                console.log('CartId inválido, limpiando cookie:', cartId);
                res.clearCookie('cartId');
                cartId = null;
            }

            if (!cartId) {
                console.log('Creando nuevo carrito para usuario anónimo');
                const cart = await cartService.createCart();
                cartId = cart._id;
                res.cookie('cartId', cartId, { 
                    maxAge: 7 * 24 * 60 * 60 * 1000, 
                    httpOnly: true 
                });
            }

            return res.redirect(`/cart/${cartId}`);
        } catch (error) {
            console.error("Error redirigiendo al carrito:", error);
            res.render('error', { 
                title: 'Inicio', 
                error, 
                page: "cart", 
                pageName: "Cart" 
            });
        }
    }

    async renderCart(req, res) {
        try {
            // Si el usuario está autenticado, asegurarnos de usar su carrito
            const user = res.locals.user || req.user;
            console.log('User info en renderCart:', user);

            if (user?.cart) {
                console.log('Usando carrito del usuario:', user.cart);
                const cart = await cartService.getCartById(user.cart);
                if (cart) {
                    // Limpiar cualquier cookie antigua de cartId
                    res.clearCookie('cartId');
                    return res.render('cart', { 
                        title: 'Carrito', 
                        cart: cart
                    });
                } else {
                    console.log('No se encontró el carrito del usuario:', user.cart);
                }
            } else {
                console.log('Usuario no tiene carrito asignado');
            }

            // Si no hay usuario o no tiene carrito, intentar usar el ID de la URL o cookie
            let cartId = req.params.cid || req.cookies.cartId;
            
            // Validar si el cartId tiene formato de MongoDB
            const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(cartId);
            if (!isValidMongoId) {
                console.log('CartId inválido, limpiando cookie:', cartId);
                res.clearCookie('cartId');
                cartId = null;
            }

            if (!cartId) {
                console.log('Creando nuevo carrito para usuario anónimo');
                const cart = await cartService.createCart();
                cartId = cart._id;
                res.cookie('cartId', cartId, { 
                    maxAge: 7 * 24 * 60 * 60 * 1000, 
                    httpOnly: true 
                });
                return res.redirect(`/cart/${cartId}`);
            }

            const cart = await cartService.getCartById(cartId);
            if (!cart) {
                console.log('Carrito no encontrado, creando uno nuevo');
                const newCart = await cartService.createCart();
                cartId = newCart._id;
                res.cookie('cartId', cartId, { 
                    maxAge: 7 * 24 * 60 * 60 * 1000, 
                    httpOnly: true 
                });
                return res.redirect(`/cart/${cartId}`);
            }

            res.render('cart', { 
                title: 'Carrito', 
                cart: cart
            });
        } catch (error) {
            console.error("Error obteniendo carrito:", error);
            // Si hay un error con el ID del carrito, limpiar la cookie
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                res.clearCookie('cartId');
                return res.redirect('/cart');
            }
            res.render('error', { 
                title: 'Error', 
                error: error.message, 
                page: "cart", 
                pageName: "Carrito" 
            });
        }
    }

    async renderNewProduct(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.render('newProduct', { title: 'Inicio' });
        } catch (error) {
            console.error("Error obteniendo productos:", error);
            res.render('error', { 
                title: 'Inicio', 
                error, 
                page: "newProduct", 
                pageName: "Crear producto", 
                role: res.locals.role, 
                isAuthenticated: res.locals.isAuthenticated
            });
        }
    }

    renderLogin(req, res) {
        res.render('auth', { title: 'Login / Registro' });
    }

    renderProfile(req, res) {
        res.render('profile', { 
            title: 'Perfil',
            user: res.locals.user, 
            role: res.locals.role, 
            isAuthenticated: res.locals.isAuthenticated
        });
    }

    async renderTickets(req, res) {
        try {
            const tickets = await ticketService.getTicketsByPurchaser(res.locals.user.email);
            res.render('tickets', { 
                title: 'Mis Compras',
                tickets
            });
        } catch (error) {
            console.error('Error obteniendo tickets:', error);
            res.render('error', { 
                title: 'Error', 
                error, 
                page: 'tickets', 
                pageName: 'Mis Compras' 
            });
        }
    }
}

export default new ViewController();
