const { Router } = require('express');
const { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } = require('../controllers/paciente');
const checkAuth = require('../middlewares/authMiddleware');

const router = Router();


router.post('/', checkAuth, agregarPaciente);
router.get('/', checkAuth, obtenerPacientes);

router.get('/:id', checkAuth, obtenerPaciente);
router.put('/:id', checkAuth, actualizarPaciente);
router.delete('/:id', checkAuth, eliminarPaciente);

module.exports = router;