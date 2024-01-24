const auth = require('./auth');
const users = require('./users');
const products = require('./products');
const orders = require('./orders');

const root = (app, next) => {
  const pkg = app.get('pkg');
  app.get('/', (req, res) => res.json({ name: pkg.name, version: pkg.version }));
  app.all('*', (req, resp, nextAll) => nextAll(404));
  return next();
};

// eslint-disable-next-line consistent-return
const register = (app, routes, cb) => {
  if (!routes.length) {
    return cb();
  }

  // Asegúrate de que el middleware de autenticación se ejecute antes de otros middlewares
  if (routes[0] === auth) {
    // Registra el middleware de autenticación primero
    routes[0](app, (err) => {
      if (err) {
        return cb(err);
      }
      // Luego, registra otros middlewares o rutas protegidas que dependan de la autenticación
      return register(app, routes.slice(1), cb);
    });
  } else {
    // Registra otros middlewares o rutas
    routes[0](app, (err) => {
      if (err) {
        return cb(err);
      }
      return register(app, routes.slice(1), cb);
    });
  }
};

module.exports = (app, next) => register(app, [
  auth,
  users,
  products,
  orders,
  root,
], next);