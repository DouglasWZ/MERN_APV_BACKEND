const Paciente = require('../models/paciente')

const agregarPaciente = async (req, res) => {
  const paciente = new Paciente(req.body)
  paciente.veterinario = req.veterinario._id

  try {
    const pacienteGuardado = await paciente.save()
    res.json(pacienteGuardado)
  } catch (error) {
    console.log(error)
  }
}

const obtenerPacientes = async (req, res) => {
  const paciente = await Paciente.find().where('veterinario').equals(req.veterinario)

  res.status(200).json(paciente)
}

const obtenerPaciente = async (req, res) => {
  const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario)

  res.status(200).json(pacientes)
  /* const { id } = req.params;
    const paciente = await Paciente.findById(id);

    // Verificar que ese paciente haya sido agregado por el veterinario autenticado
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'Acción no válida' });
    }

    if (paciente) {
        res.status(200).json(
            paciente
        )
    } */
}

const actualizarPaciente = async (req, res) => {
  const { id } = req.params
  const paciente = await Paciente.findById(id)

  // Si no hay paciente
  if (!paciente) {
    return res.status(404).json({ msg: 'No encontrado' })
  }

  // Verificar que ese paciente haya sido agregado por el veterinario autenticado
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: 'Acción no válida' })
  }

  // Actualizar Paciente
  paciente.nombre = req.body.nombre || paciente.nombre
  paciente.propietario = req.body.propietario || paciente.propietario
  paciente.correo = req.body.correo || paciente.correo
  paciente.fecha = req.body.fecha || paciente.fecha
  paciente.sintomas = req.body.sintomas || paciente.sintomas

  try {
    const pacienteActualizado = await paciente.save()
    res.json(pacienteActualizado)
  } catch (error) {
    console.log(error)
  }
}

const eliminarPaciente = async (req, res) => {
  const { id } = req.params
  const paciente = await Paciente.findById(id)

  // Si no hay paciente
  if (!paciente) {
    return res.status(404).json({ msg: 'No encontrado' })
  }

  // Verificar que ese paciente haya sido agregado por el veterinario autenticado
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: 'Acción no válida' })
  }

  try {
    await paciente.deleteOne()
    res.json({ msg: 'Paciente Eliminado...' })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente
}

// .toString va a evaluarlos como un string y no como un Obectid como normalmente lo tira
// todo esto hay que hacerlo para poder comparar ids de mongo

// En la parte de actualizar el paciente, si solo enviamos un campo y hemos definido todos los demas
// tirará error, para eso le ponemos el operador ó que le indicamos que si no le agregamos la propiedad, le agregue el campo que tiene por defecto



