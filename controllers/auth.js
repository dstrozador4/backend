const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');

const login = async (req = request, res = response) => {
	const { email, password } = req.body;

	try {
		const usuarioDB = await Usuario.findOne({ email });

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe Email',
			});
		}

		//verificar contraseña
		const validPassword = bcrypt.compareSync(password, usuarioDB.password);
		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Contraseña no valida',
			});
		}

		//Generar Token

		const token = await generarJWT(usuarioDB.id);

		res.status(200).json({
			ok: true,
			token,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Hable con administrador',
		});
	}
};

module.exports = {
	login,
};
