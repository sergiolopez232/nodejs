/*
    El mód. passport permite fijar y configurar los métodos de autenticación.
    Consultar http://www.passportjs.org/docs/ para más información
 */
const passport = require('passport');
//  Vamos autenticar con nuestra propia base de datos (local)
const LocalStrategy = require('passport-local').Strategy;

const dbconn = require('../database');
const helpers = require('./helpers');  //cifrado /descrifrado de contraseña

//  Definimos una forma de autenticación que llamamos 'local.registro'
//  para tratar el registro de un nuevo usuario.
//  Aquí recibiremos los campos a comprobar 
passport.use('local.registro', new LocalStrategy({
  usernameField: 'username',  //  recibimos el campo 'username' desde el formulario
  passwordField: 'password',  //  recibimos el campo 'password' desde el formulario
  passReqToCallback: true     //  Como hay más datos, se añade esta opción que recibe req.body
}, async (req, username, password, done) => { 
  // el param. 'done' se utiliza para que continue después de hacer la autenticación.
  // Asignamos el resto de datos que llegaron en el req.body
  
  //console.log(req.body);
  
  const { fullname } = req.body;
  let newUser = {
    fullname,
    username,
    password
  };
  //  Ciframos la contraseña
  newUser.password = await helpers.encryptPassword(password);
  // Grabamos en la BD
  const result = await dbconn.query('INSERT INTO users SET ? ', newUser);
  // console.log(result);
  newUser.id = result.insertId; // añadimos el id al usuario nuevo
  return done(null, newUser);  // se pasa el usuario al serializeUser para la session
}));

//  Definimos otra forma de autenticación que llamamos 'local.login'
//  para tratar el registro de un nuevo usuario.
//  Aquí recibiremos los campos a comprobar 
passport.use('local.login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  console.log(req.body);
  //console.log(username);
  //console.log(password);
  const rows = await dbconn.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.username +'.')); // el 1er param. indica que na ha habido error
    } else {
      done(null, false, req.flash('message', 'Clave erronea.'));
    }
  } else {
    return done(null, false, req.flash('message', 'El usuario no existe.'));
  }
}));


//  Según la docum. en http://www.passportjs.org/docs/configure/
//  Es necesario utilizar 'serializeUser' y 'deserializeUser' si se utilizan sesiones
passport.serializeUser((user, done) => {
  done(null, user.id);  // el param. 1 indica si hay error
});

passport.deserializeUser(async (id, done) => {
  const rows = await dbconn.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});

