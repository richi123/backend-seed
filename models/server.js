const express = require('express')
var cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'
        //Conectar a la base de datos
        this.connectDb()
        //Middlewares
        this.middlewares();
        //rutas para aplicacion


        this.routes()

    }

    async connectDb() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors())
        // Lectura y parseo del body
        this.app.use( express.json() )
        //directorio publico
        this.app.use(express.static('public'))

    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/user.routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en puerto', this.port)
        })
    }
}

module.exports = Server