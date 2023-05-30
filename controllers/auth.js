const bcryptjs = require("bcryptjs");

const Veterinario = require("../models/veterinario");
const generarJWT = require("../helpers/generarJWT");

const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const veterinario = await Veterinario.findOne({ correo });
    if (!veterinario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo" /* Quitar esto por seguridad, solo es para saber que es el correo */,
      });
    }

    if (!veterinario.confirmado) {
      return res.status(400).json({
        msg: "Usuario no confirmado",
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, veterinario.password); //CompareSync, Compara el password que viene del body con el de la BD
    if (!validPassword) {
      return res.status(400).json({
        msg: "Correo / Password no son correctos - password" /* Quitar esto por seguridad, solo es para saber que es la contraseña */,
      });
    }

    // Generar el JWT
    const token = await generarJWT(veterinario.id);

    res.json({
      msg: "Login Ok",
      _id: veterinario._id,
      nombre: veterinario.nombre,
      correo: veterinario.correo,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};

