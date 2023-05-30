const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_CNN, {
            UseNewUrlParser: true,
            UseUnifiedTopology: true,
        })

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en ${url}`);

    } catch (error) {
        console.log(error);
        throw new Error('Error al querer iniciar la base de datos :(');
    }
}

module.exports = dbConnection;