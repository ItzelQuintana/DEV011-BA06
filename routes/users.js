const bcrypt = require('bcrypt');
const { connect } = require('../connect');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { getUsers, postUsers } = require('../controller/users');

const initAdminUser = async (app, next) => {
  // Obtiene las credenciales del administrador desde la configuración de la aplicación.
  const { adminEmail, adminPassword } = app.get('config');

  // Si falta alguna credencial del administrador, no se realiza ninguna acción.
  if (!adminEmail || !adminPassword) {
    return next();
  }

  // Crear un objeto que representa al administrador con la información proporcionada.
  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    role: 'admin',
  };

  try {
    // Conectar a la base de datos.
    const db = connect();
    const usersCollection = db.collection('user');

    // Intentar buscar un usuario con el correo electrónico del administrador en la colección de usuarios.
    const adminUserExists = await usersCollection.findOne({
      email: adminEmail,
    });

    // Si no se encuentra un usuario con ese correo electrónico, insertar el objeto del administrador en la colección de usuarios.
    if (!adminUserExists) {
      await usersCollection.insertOne(adminUser);
    } else {
      console.error('El administrador ya existe');
    }

    // Continuar con el flujo.
    next();
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso.
    console.error('Error durante la inicialización del administrador:', error);

    // Continuar con el flujo.
    next();
  }
};
/*
 * Español:
 *
 * Diagrama de flujo de una aplicación y petición en node - express :
 *
 * request  -> middleware1 -> middleware2 -> route
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * la gracia es que la petición va pasando por cada una de las funciones
 * intermedias o "middlewares" hasta llegar a la función de la ruta, luego esa
 * función genera la respuesta y esta pasa nuevamente por otras funciones
 * intermedias hasta responder finalmente a la usuaria.
 *
 * Un ejemplo de middleware podría ser una función que verifique que una usuaria
 * está realmente registrado en la aplicación y que tiene permisos para usar la
 * ruta. O también un middleware de traducción, que cambie la respuesta
 * dependiendo del idioma de la usuaria.
 *
 * Es por lo anterior que siempre veremos los argumentos request, response y
 * next en nuestros middlewares y rutas. Cada una de estas funciones tendrá
 * la oportunidad de acceder a la consulta (request) y hacerse cargo de enviar
 * una respuesta (rompiendo la cadena), o delegar la consulta a la siguiente
 * función en la cadena (invocando next). De esta forma, la petición (request)
 * va pasando a través de las funciones, así como también la respuesta
 * (response).
 */


module.exports = (app, next) => {

  app.get('/users', requireAdmin, getUsers);

  app.get('/users/:uid', requireAuth, (req, resp) => {
  });

  app.post('/users', requireAdmin, (req, resp, next) => {
    // TODO: Implement the route to add new users
  });

  app.put('/users/:uid', requireAuth, (req, resp, next) => {
  });

  app.delete('/users/:uid', requireAuth, (req, resp, next) => {
  });

  initAdminUser(app, next);
};
