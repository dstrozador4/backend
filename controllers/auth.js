const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req = request, res = response) => {
	const googleToken = req.body.token;

	try {
		const { name, email, picture } = await googleVerify(googleToken);

		const usuarioDB = await Usuario.findOne({ email });
		let usuario;

		if (!usuarioDB) {
			//si no existe usuario
			usuario = new Usuario({
				nombre: name,
				email,
				password: '@@@',
				imagen: picture,
				google: true,
			});
		} else {
			//existe usuario
			usuario = usuarioDB;
			usuario.google = true;
			usuario.password = '@@@';
		}

		//Guardar base de datos

		await usuario.save();

		//generar token

		const token = await generarJWT(usuario.id);

		res.json({
			ok: true,
			token,
		});
	} catch (error) {
		res.status(401).json({
			ok: false,
			msg: 'token no es valido',
		});
	}
};

const renewToken = async (req, res = response) => {
	const uid = req.uid;

	//generar token
	const token = await generarJWT(uid);

	//Obtener usuario por UID
	const usuarioDB = await Usuario.findById(uid);
	if (!usuarioDB) {
		return res.status(404).json({
			ok: false,
			msg: 'Usuario no encontrado',
		});
	}

	res.json({
		ok: true,
		token,
		usuarioDB,
	});
};

module.exports = {
	login,
	googleSignIn,
	renewToken,
};
