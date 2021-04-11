const express = require('express');
const router = express.Router();

//Middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Controlleurs
const sauceCtrl = require('../controllers/sauce');

// Routes
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.voteSauce)

router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);


module.exports = router;