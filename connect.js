const config = require('./config');
// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;
const { MongoClient } = require('mongodb');

const client = new MongoClient(config.dbUrl);
function connect() {
  try {
    
    const db = client.db('burgerqueen06'); // Reemplaza <NOMBRE_DB> por el nombre del db
    console.log('Base de datos conectada');
    return db;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };
