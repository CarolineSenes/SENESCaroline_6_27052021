////////// contient logique de routing pour sauce //////////

//importe Express
const express = require('express');

//création d'un routeur Express
const router = express.Router();

//importe le middelware de protection de route
const auth = require('../middelware/auth');

//importe la logique métier de sauce
const sauceCtrl = require('../controllers/sauce');

//routes disponibles dans l'application avec leur nom de fonction (avec une sémantique qui permet de savoir ce qu'elles font)
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);


//exporte le routeur Express
module.exports = router;