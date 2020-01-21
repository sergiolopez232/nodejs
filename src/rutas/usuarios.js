const express = require('express');
const router = express.Router();

const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../lib/acceso');

//	pantalla de registro
//	No quiero que se vea si ya esta logeado, por lo que utilizo el segndo param.
router.get('/registro', isNotLoggedIn, (req, res) => {
    res.render('layouts/registro');
});
//	ruta para gestionar los datos de registro devueltos por el formulario en '/registro' (get)
router.post('/registro', isNotLoggedIn, passport.authenticate('local.registro', {
  	successRedirect: '/perfil',
  	failureRedirect: '/registro',
  	failureFlash: true
}));
//	pantalla de login
router.get('/login', isNotLoggedIn, (req, res) => {
	console.log(req);
    res.render('layouts/login');
});
//	ruta para gestionar los datos de login devueltos por el formulario en '/login' (get)
router.post('/login', (req, res, next) => {
	passport.authenticate('local.login', {
	  	successRedirect: '/perfil',
	  	failureRedirect: '/login',
	  	failureFlash: true
	})(req,res,next);
});



module.exports = router;