const jwt = require('jsonwebtoken');
const Veterinario = require('../models/veterinario');

const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

            req.veterinario = await Veterinario.findById(decoded.uid).select('-password -token -confirmado');

            return next();
        } catch (error) {
            const e = new Error('Token no Válido');
            return res.status(403).json({ msg: e.message });
        }
    }

    if (!token) {
        const error = new Error('Token no válido o inexistente');
        res.status(403).json({ msg: error.message });
    }

    next();
}

module.exports = checkAuth;