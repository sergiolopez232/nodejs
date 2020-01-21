/*
		Cargamos/instanciamos los módulos que se necesitan
 */
const express = require('express');
//	morgan muestra en consola las peticiones que llegan al servidor. Se usa sólo en desarrollo
const morgan = require('morgan');
const path = require('path');
//	Handlebar es el sistema para manejo de platillas
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');  //  para los mensajes en pantalla
const session = require('express-session'); // para manejar sesiones
const MySQLStore = require('express-mysql-session')(session); // para guardar la sesión en la BD
//  este mód. se importa aquí para poder ejecutar su cód., pero se utiliza (y se importa de nuevo)
//  en 'lib/passpor.js'
const passport = require('passport'); //  para autentificar a los usuarios

//	Lo necesita la sesión para almacenarla en la BD
const {database} = require('./keys');

// Intializaciones
const app = express();		// app es el objeto que representa nuestra aplicación
require('./lib/passport');  // contiene la config. del proceso de autentificación de usaurios

/*
		SETTINGS
 */ 
app.set('port', process.env.PORT || 3000);	// puerto en el que escuchará el servidor nodejs
//	fijo el path de la carpeta views
app.set('views', path.join(__dirname, 'vistas'));
//	configuro handlebars
//	'.hbs' --> nombre del motor
//	resto --> configuración de la instancia de HB (exphbs)
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
//	asigno el nombre '.hbs' al motor de vistas
//	(configurado en la sentencia anterior)
app.set('view engine', '.hbs');

/*
		MIDDLEWARES
 */
app.use(session({
  secret: 'CPL-CursoWebLeon-2019',
  resave: false, // para que no se renueve
  saveUninitialized: false, // para que no se guarde sin inicializar
  //	Si guardamos en la BD, necesitamos el mód. express-mysql-session.
  store: new MySQLStore(database) // para guardarla en la BD
}));
app.use(flash());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
//  Según la docum. en http://www.passportjs.org/docs/configure/
//  es necesario inicializar passport
app.use(passport.initialize()); // se incializa, pero aquí no sabe dónde guardar los datos
app.use(passport.session());  //  indicamos que utilizará los datos en una sesión


/*
		VARIABLES GLOBALES
 */ 
app.use((req, res, next) => {

	//	Este mensaje se creó en la ruta '/links/nuevo'.
	//	Desde aquí lo ponemos en una variable global 'success' 
	//	(app.locals.nombre-de-variable) para que este disponible
	//	para todos los módulos
	app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user = req.user
  next();
});

// Rutas
app.use(require('./rutas/index'));	// rutas de primer nivel
app.use(require('./rutas/usuarios')); // rutas de operaciones con los links de usuarios
app.use('/links', require('./rutas/links'));  // rutas de operaciones con los links de enlaces


// Public
app.use(express.static(path.join(__dirname, 'public')));


// Starting
app.listen(app.get('port'), () => {
  console.log('Server escuchando en el puerto ', app.get('port'));
});