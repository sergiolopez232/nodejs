const mysql = require('mysql'); 
/*
    Como la conexión con la BD necesita utilizar callbacks, pero el módulo 'mysql'
    no admite promesas, utilizamos el módulo de node 'promisify' que 
    posibilita/convierte usar callbacks con async/await 
 */
const { promisify }= require('util');
//  Cargamos las variables de conexión a la BD
const { database } = require('./keys');
//  Creamos un pool de conexiones
const dbconn = mysql.createPool(database);
//  Hacemos la conexión en este módulo para no tener que realizarla cada vez que es necesario 
dbconn.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  }

  if (connection) connection.release();
  console.log('DB is Connected');
  return;
});

// Promisify Pool Querys
dbconn.query = promisify(dbconn.query);
//  exportamos la conexión
module.exports = dbconn;