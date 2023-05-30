const express = require('express');
const dbConnection = require('../database/config');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.puerto = process.env.PORT

        this.veterinariosPath = '/api/veterinarios'
        this.authPath = '/api/auth'
        this.pacientesPath = '/api/pacientes'

        //Conectar Base de datos
        this.conectarBD();
        // Ejecución de los Middlewares
        this.middlewares();

        // Rutas
        this.routes(); 
    }

    // Conexion a BD
    async conectarBD() {
        await dbConnection();
    }

    // Middlewares
    middlewares() {

        // CORS

        // Clase 523. min: 8:9 (explicacion detallada de los cors);

        const dominiosPermitidos = [process.env.FRONTEND_URL];

        const corsOptions = {
            origin: function (origin, callback) {
                if (dominiosPermitidos.indexOf(origin) !== -1) {
                    callback(null, true)
                } else {
                    callback(new Error('No permitido por CORS'));
                }
            }
        }

        this.app.use(cors(corsOptions));

        const DIRECTORIO_PERMITIDO_CORS = process.env.FRONTEND_URL;
        this.app.use(cors({
            origin: DIRECTORIO_PERMITIDO_CORS
        }));

        // Lectura y parseo del body
        this.app.use(express.json());

    }

    // Rutas
    routes() {
        this.app.use(this.veterinariosPath, require('../routes/veterinario'));
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.pacientesPath, require('../routes/paciente'));
    }

    // Escucha de la aplicación
    listen() {
        this.app.listen(this.puerto, () => {
            console.log(`Servidor ejecutandose correctamente en el puerto ${this.puerto}`);
        })
    }
}

module.exports = Server;