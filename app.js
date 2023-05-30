require('dotenv').config();

const Server = require('./models/server');

const server = new Server();

// Manda a llamar al método listen de la clase Server
server.listen();