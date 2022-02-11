const express = require('express')
var cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.paths = {
            auth: '/api/auth',
            user: '/api/usuarios',
            categories: '/api/categorias',
            products: '/api/productos',
            search: '/api/buscar'
        }
        //Conectar a la base de datos
        this.connectDb();
        //Middlewares
        this.middlewares();
        //rutas para aplicacion
        this.routes();
    }

    async connectDb() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());
        // Lectura y parseo del body
        this.app.use( express.json() );
        //directorio publico
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.user, require('../routes/user.routes'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en puerto', this.port)
        });
    }
}

module.exports = Server