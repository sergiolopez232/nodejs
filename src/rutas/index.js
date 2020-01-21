const express = require('express');
const router = express.Router();
/*
		CONEXIÓN CON BD
 */
//	Esto debe aparecer en cada módulo que necesite conexión a la BD
//	Si no necesita conexión con la BD, se puede eliminar
const pool = require('../database');  

/*
	Protección de rutas
 */
const { isLoggedIn, isNotLoggedIn } = require('../lib/acceso')

/*
		RUTAS
 */
//	ruta raiz (pág. de inicio)
router.get('/', (req, res) => {
    res.render('../vistas/links/index.hbs');
});

//	pantalla de salida
router.get('/salir', (req, res) => {
    //	Passport añade al objeto request (req) varios métodos
    //	entre ellos el 'logout'     
    req.logout();
    res.redirect('/login');
});

//	pantalla de perfil
//	con el segundo parámetro, protejo la ruta:
//		si es true, continuo, si es false, el helper acceso redirige a login
router.get('/perfil', isLoggedIn, (req, res) => {  
    res.render('perfil');
});

module.exports = router;