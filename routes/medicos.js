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
} = require('../controllers/medico');

const router = Router();

router.get('/', getMedicos);
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

module.exports = router;
