const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { connect } = require('../connect');

const { secret } = config;

module.exports = async (app, nextMain) => {
  app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400, { error: 'Correo electrónico y contraseña son requeridos.' });
    }

    try {
      // Conectar a la base de datos
      const db = await connect();

      // Buscar al usuario por correo electrónico
      const user = await db.collection('users').findOne({ email });

      if (!user) {
        return next(401, { error: 'Usuario no encontrado.' });
      }

      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return next(401, { error: 'Contraseña incorrecta.' });
      }

      // Generar un token JWT
      const token = jwt.sign({ userId: user._id, email: user.email }, secret, {
        expiresIn: '1h', // Puedes ajustar la duración del token según tus necesidades
      });

      // Enviar el token como respuesta
      res.json({ token });

      // Cerrar la conexión a la base de datos
      await db.close();
    } catch (error) {
      console.error('Error en la autenticación:', error.message);
      return next(500, { error: 'Error en la autenticación.' });
    }
  });

  return nextMain();
};