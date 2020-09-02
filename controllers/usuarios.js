const { response, request } = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
	const desde = Number(req.query.desde) || 0;

	const [usuarios, total] = await Promise.all([
		Usuario.find({}, 'nombre email role google imagen').skip(desde).limit(10),
		Usuario.countDocuments(),
	]);

	res.status(200).json({
		ok: true,
		usuarios: usuarios,
		total,
	});
};

const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const existeEmail = await Usuario.findOne({ email });

		if (existeEmail) {
			return res.status(400).json({
				ok: false,
				msg: 'El correo está registrado',
			});
		}

		const usuario = new Usuario(req.body);

		//Encriptar contraseña
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		//guardar Usuario
		await usuario.save();

		const token = await generarJWT(usuario.id);

		res.json({
			ok: true,
			token,
			usuario,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado',
		});
	}
};

const actualizarUsuario = async (req, res = response) => {
	//TODO: VAlidar token y comprobar si  es el usuario correcto

	const uid = req.params.id;

	try {
		const usuarioDB = await Usuario.findById(uid);
		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe un usuario por ese ID',
			});
		}

		//Actualizaciones
		const { password, google, email, ...campos } = req.body;

		if (usuarioDB.email != email) {
			const existeEmail = await Usuario.findOne({ email: email });
			if (existeEmail) {
				return res.status(400).json({
					ok: false,
					msg: 'Ya existe un usuario con ese email, Ups',
				});
			}
		}

		if (!usuarioDB.google) {
			campos.email = email;
		} else if (usuarioDB.email !== email) {
			return res.status(400).json({
				ok: false,
				msg: 'Usuario de google no puede cambiar su correo',
			});
		}

		const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

		res.status(200).json({
			ok: true,
			msg: 'Usuario actualizado correctamente',
			usuario: usuarioActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado',
		});
	}
};

const borrarUsuario = async (req = request, res = response) => {
	const uid = req.params.id;

	try {
		const usuarioDB = await Usuario.findById(uid);
		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe un usuario por ese ID',
			});
		}

		await Usuario.findByIdAndDelete(uid);

		res.status(200).json({
			ok: true,
			msg: 'Usuario Eliminado',
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Error interno RAA',
		});
	}
};

module.exports = {
	getUsuarios,
	crearUsuario,
	actualizarUsuario,
	borrarUsuario,
};
