const { validationResult } = require('express-validator');

// Middleware para poder validar los campos
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next()
}

// Importante exportar la funcion con las llaves, ya que sino generaria error, no se porque pero tira error
module.exports = {
    validarCampos
}