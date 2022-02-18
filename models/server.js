const express = require('express')
var cors = require('cors')
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config')

class Server {
    // Inicializar constructor
    constructor() {
        // Inicializar Servidor
        this.app = express();
        // Inicializar puerto de servidor
        this.port = process.env.PORT
        // Establecer paths de Rutas
        this.paths = {
            auth: '/api/auth',
            user: '/api/usuarios',
            categories: '/api/categorias',
            products: '/api/productos',
            search: '/api/buscar',
            uploads: '/api/uploads'
        }
        //Ejecutar la conexion a la base de datos
        this.connectDb();
        //Inicializar los Middlewares
        this.middlewares();
        //Inicializar las rutas para aplicacion
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
        // Fileupload - Carga de archivo
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.user, require('../routes/user.routes'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en puerto', this.port)
        });
    }
}

module.exports = Server