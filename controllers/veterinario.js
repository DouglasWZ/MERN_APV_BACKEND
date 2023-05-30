const bcryptjs = require("bcryptjs");

const Veterinario = require("../models/veterinario");
const generarId = require("../helpers/generarId");
const emailRegistro = require("../helpers/emailRegistro");
const emailOlvidePassword = require("../helpers/emailOlvidePassword");

// PETICIONES HTTP

const registrar = async (req, res) => {
  const { nombre, correo, password } = req.body;
  const veterinario = new Veterinario({ nombre, correo, password });

  // Prevenir usuarios duplicados
  const existeUsuario = await Veterinario.findOne({ correo });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({
      // Para deterner la ejecucion de la aplicación
      msg: error.message, // para mostrar el error creado arriba
    });
  }

  // Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  veterinario.password = bcryptjs.hashSync(password, salt);

  try {
    //Guardar un nuevo Veterinario
    const veterinarioGuardado = await veterinario.save();

    // Enviar el Email

    emailRegistro({
      correo,
      nombre,
      token: veterinarioGuardado.token,
    });

    res.status(200).json({
      msg: "Registrando usuario...",
      veterinarioGuardado,
    });
  } catch (error) {
    console.log(error);
  }
};

// Confirmar Cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(404).json({
      msg: error.message,
    });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();

    res.json({
      msg: "Usuario confirmado correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

// Obtener perfil autenticado
const perfil = (req, res) => {
  const { veterinario } = req;

  res.status(200).json({
    perfil: veterinario,
  });
};

// Resetear Password

const olvidePassword = async (req, res) => {
  const { correo } = req.body;

  const existeVeterinario = await Veterinario.findOne({ correo });
  if (!existeVeterinario) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeVeterinario.token = generarId();
    await existeVeterinario.save();

    // Enviar email con instrucciones
    emailOlvidePassword({
      correo,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    });

    res.json({ msg: "Hemos enviado un correo con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Veterinario.findOne({ token });

  if (tokenValido) {
    //El token es válido el usuario existe
    res.json({ msg: "Token válido y el usuario existe" });
  } else {
    const error = new Error("Token no válido");
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinario.token = null;
    veterinario.password = password;

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    veterinario.password = bcryptjs.hashSync(password, salt);

    // Guardar los cambios
    await veterinario.save();
    res.status(200).json({
      msg: "Password modificado correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  const { correo } = req.body;
  if (veterinario.correo !== req.body.correo) {
    const existeEmail = await Veterinario.findOne({ correo });
    if (existeEmail) {
      const error = new Error("Ese correo ya está en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinario.nombre = req.body.nombre;
    veterinario.correo = req.body.correo;
    veterinario.web = req.body.web;
    veterinario.telefono = req.body.telefono;

    const veterinarioActualizado = await veterinario.save();
    res.json(veterinarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
  // Leer datos
  const { id } = req.veterinario;
  const { pwd_actual, pwd_nuevo } = req.body;

  // Comprobar que el veterinario existe
  const veterinario = await Veterinario.findById(id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  // Comprobar su password
  if (await veterinario.comprobarPassword(pwd_actual)) {
    // Alamacenar nuevo Password

    veterinario.password = pwd_nuevo;
    await veterinario.save();
    res.json({msg: "Password modificado correctamente"})

    /* veterinario.password = pwd_nuevo;
    
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    pwd_nuevo = bcryptjs.hashSync(pwd_nuevo, salt);

    // Guardar los cambios
    await veterinario.save();
    res.status(200).json({
      msg: "Password modificado correctamente",
    });
 */
    
  } else {
    const error = new Error("El Password Actual es Incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  registrar,
  perfil,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};

// Importante, el try catch se utiliza cuando hay que cambiar algo en la BD
