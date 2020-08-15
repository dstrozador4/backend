const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const borrarImagen = (path) => {
	if (fs.existsSync(path)) {
		//BorrarImagenANteriror
		fs.unlinkSync(path);
	}
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
	let pathViejo = '';
	switch (tipo) {
		case 'medicos':
			const medico = await Medico.findById(id);
			if (!medico) {
				console.log('Medico no existe en este ID');
				return false;
			}

			pathViejo = `./uploads/medicos/${medico.imagen}`;
			borrarImagen(pathViejo);

			medico.imagen = nombreArchivo;
			await medico.save();
			return true;

			break;
		case 'usuarios':
			const usuario = await Usuario.findById(id);
			if (!usuario) {
				console.log('Usuario no existe en este ID');
				return false;
			}

			pathViejo = `./uploads/usuarios/${usuario.imagen}`;
			borrarImagen(pathViejo);

			usuario.imagen = nombreArchivo;
			await usuario.save();
			return true;
			break;
		case 'hospitales':
			const hospital = await Hospital.findById(id);
			if (!hospital) {
				console.log('Hospital no existe en este ID');
				return false;
			}

			pathViejo = `./uploads/hospitales/${hospital.imagen}`;
			borrarImagen(pathViejo);

			hospital.imagen = nombreArchivo;
			await hospital.save();
			return true;

			break;

		default:
			break;
	}
};

module.exports = {
	actualizarImagen,
};
