const jwt = require('jsonwebtoken');
const { connect } = require('../connect');
const config = require('../config');

module.exports = (app, nextMain) => {
  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;

    try {
      const db = connect();
      const collection = db.collection('users');

      const userValid = await collection.findOne({ email }, { projection: { password: 0 } });

      if (userValid && userValid._id && userValid.email && userValid.role) {
        const tokenIs = jwt.sign(
          { uid: userValid._id, email: userValid.email, role: userValid.role },
          config.secret,
          { expiresIn: '1h' }
        );

        console.log('Token generado:', tokenIs);
        resp.json({ token: tokenIs });
      } else {
        next(401);
      }
    } catch (error) {
      console.error('Error en la autenticación:', error.message);
      return next(500, { error: 'Error en la autenticación.' });
    }
  });

  return nextMain();
};