const express = require('express');
const router = express.Router();

//	cargamos la conexión a la BD
const dbconn = require('../database');
//  para proteger las rutas
const { isLoggedIn, isNotLoggedIn } = require('../lib/acceso')

//	ruta para listar los enlaces
router.get('/',  async (req, res) => {
    //console.log(req);
    const links = await dbconn.query('SELECT * FROM links WHERE user_id = ? OR publico',[req.user.id]);
      // comentar despues de probarlo
    res.render('links/lista', { links });
});

//	ruta para form de añadir enlace
router.get('/nuevo', isLoggedIn, (req, res) => {
    res.render('links/nuevo');
});

//	ruta para añadir enlace
router.post('/nuevo', isLoggedIn, async(req, res) => {   // poner async(req,res) al descomentar lin. 30
	//console.log(req.body);  //  una vez probado, comentar y descomentar lo siguiente
	 const { title, url, description, publico } = req.body;
	 const newLink = {
        title,
        url,
        description,
        publico,
        user_id: req.user.id
    };
    await dbconn.query('INSERT INTO links set ?', [newLink]);
    //res.send('Recibido desde nuevo enlace');  // Envía un texto al cliente. Usado de prueba.
    //  La siguiente sentencia crea un mensaje.
    //  Esto SOLO LO CREA. Debe hacerse disponible para todas las vistas 
    //  desde el index.js principal mediante una variable global.
    req.flash('success','Enlace guardado.');
    res.redirect('/links');  // redirige a la vista de lista
});

//	ruta para form de modificar enlace
/*!C
router.get('/editar', (req, res) => {
    res.send('Editar enlace');
});
*/

router.get('/editar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    //console.log(id);
    //res.send('Editando ' + id);
    const links = await dbconn.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/editar', {link: links[0]});
});


//	ruta para cambiar en la BD
/*
router.post('/editar', (req, res) => {
	console.log(req.body);
    res.send('Recibido desde modificar el enlace de usuario en la BD');
});
*/

router.post('/editar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url, publico } = req.body; 
    const newLink = {
        title,
        description,
        url,
        publico,
        user_id: req.user.id
    };
    await dbconn.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    //req.flash('success', 'Enlace modificado.');
    res.redirect('/links');
});


//	ruta para form de borrar enlace
/*
router.get('/borrar', (req, res) => {
    res.end('Formulario para eliminar enlace de usuario');
});
*/

router.get('/borrar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    //console.log(id);
    //res.send('Borrado');
    
    await dbconn.query('DELETE FROM links WHERE ID = ?', [id]);
    //req.flash('success', 'Enlace borrado de la BD.');
    res.redirect('/links');
    
});

//	ruta para borrar en la BD
router.post('/eliminar', isLoggedIn, (req, res) => {
    res.end('función para borrar el enlace de usuario en la BD');
});

module.exports = router;