const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');

const { registrar, perfil, confirmar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } = require('../controllers/veterinario');

// Importacion de Middlewares
const checkAuth = require('../middlewares/authMiddleware');

const router = Router();

// Rutas Públicas 
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es Obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], registrar);

router.get('/confirmar/:token', confirmar); // Confirma el token de registro, pegar el token de registro en la URL
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

// Rutas Privadas
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

module.exports = router;