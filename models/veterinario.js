const { Schema, model } = require('mongoose');
const generarId = require('../helpers/generarId');
const bcryptjs = require("bcryptjs");


const VeterinarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true // para eliminar los espacios en blanco tanto al inicio, como al final
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true // para poder validar mas adelante que el correo no sea duplicado y sea unico 
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId
    },
    confirmado: { // para validar que su cuenta esta confirmada. se le enviara un correo para validarlo, y en caso de estar validado se cambiara su estado a true
        type: Boolean,
        default: false
    }
});

// toda la parte de abajo a excepcion del export, se utilizo solo en la parte de modificar la contraseña

// Para encriptar la contraseña, pero solo se utilizo en todo el proyecto a la hora de cambiar la contraseña
VeterinarioSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
})

/* Para comprobar el password*/
VeterinarioSchema.methods.comprobarPassword = async function(
    passwordFormulario
) {
    return await bcryptjs.compare(passwordFormulario, this.password);
}

module.exports = model('Veterinario', VeterinarioSchema);