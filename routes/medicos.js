/*
    Medicos
    Ruta: 'api/medico'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
	getMedicos,
	crearMedico,
	actualizarMedico,
	borrarMedico,
	getMedicoById,
} = require('../controllers/medico');

const router = Router();

router.get('/', validarJWT, getMedicos);
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
		check('hospital', 'El hospital id debe de ser el validor').isMongoId(),
		validarCampos,
	],
	crearMedico
);
router.put(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre del hostpital es necesario').not().isEmpty(),
		check('hospital', 'El hospital es requerido').not().isEmpty(),
		validarCampos,
	],
	actualizarMedico
);
router.delete('/:id', validarJWT, borrarMedico);
router.get('/:id', validarJWT, getMedicoById);

module.exports = router;
