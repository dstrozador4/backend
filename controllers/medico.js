const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {
	const medicos = await await Medico.find()
		.populate('usuario', 'nombre imagen')
		.populate('hospital', 'nombre imagen');
	res.json({
		ok: true,
		medicos,
	});
};

const getMedicoById = async (req, res = response) => {
	const id = req.params.id;
	try {
		const medico = await await Medico.findById(id)
			.populate('usuario', 'nombre imagen')
			.populate('hospital', 'nombre imagen');
		res.json({
			ok: true,
			medico,
		});
	} catch (error) {
		console.log(error);
		res.json({
			ok: false,
			msg: 'Hable con el admin',
		});
	}
};

const crearMedico = async (req, res = response) => {
	const uid = req.uid;
	const medico = new Medico({
		usuario: uid,
		...req.body,
	});

	try {
		const medicoDB = await medico.save();
		res.json({
			ok: true,
			medico: medicoDB,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'Hable con el admin',
		});
	}
};

const actualizarMedico = async (req, res = response) => {
	const uid = req.uid;
	const id = req.params.id;

	try {
		const medicoDB = await Medico.findById(id);
		if (!medicoDB) {
			return res.status(404).json({
				ok: false,
				msg: 'No se encontró medico',
			});
		}

		const cambiosMedico = {
			...req.body,
			usuario: uid,
		};

		const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

		res.json({
			ok: true,
			medicoActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Habvle con elñ admin',
		});
	}
};

const borrarMedico = async (req, res = response) => {
	const id = req.params.id;

	try {
		const medicoDB = await Medico.findById(id);

		if (!medicoDB) {
			return res.status(404).json({
				ok: false,
				msg: 'No se encontró medico',
			});
		}

		await Medico.findByIdAndDelete(id);

		res.json({
			ok: true,
			msg: 'Medico eliminado',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Habvle con elñ admin',
		});
	}
};

module.exports = {
	getMedicos,
	crearMedico,
	actualizarMedico,
	borrarMedico,
	getMedicoById,
};
