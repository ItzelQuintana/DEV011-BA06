
const { MongoClient } = require('mongodb');
const config = require('./config');
// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;
const client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
  try {
    await client.connect();
    const db = client.db('burgerqueen06');
    console.log('Base de datos conectada');
    return db;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
}
module.exports = { connect };
