const { MongoClient } = require('mongodb');
const config = require('./config');

const client = new MongoClient(config.dbUrl);

async function connect() {
  try {
    await client.connect();
    const db = client.db('burgerqueen06'); // Reemplaza <NOMBRE_DB> por el nombre del db
    console.log('Base de datos conectada');
    return db;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };
