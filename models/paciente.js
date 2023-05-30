const { Schema, model, mongoose } = require('mongoose');

const PacienteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true // para eliminar los espacios en blanco tanto al inicio, como al final
    },
    propietario: {
        type: String,
        required: [true, 'El propietario es obligatorio']
    },
    correo: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    veterinario: { // Para relacionar el veterinario con el paciente 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario'
    }

},
    {
        timestamps: true, // Para que cree las columnas de editado y creado
    }

);

module.exports = model('Paciente', PacienteSchema);