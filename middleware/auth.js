const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => {
  // Obtener el encabezado de autorización de la solicitud.
  const { authorization } = req.headers;

  // Si no hay encabezado de autorización, continuar con el siguiente middleware.
  if (!authorization) {
    console.log('No hay encabezado de autorización.');
    return next();
  }

  // Dividir el encabezado de autorización para obtener el tipo y el token.
  const [type, token] = authorization.split(' ');

  // Verificar que el tipo sea 'bearer'.
  if (type.toLowerCase() !== 'bearer') {
    console.log('El tipo de token no es "bearer".');
    return next();
  }

  // Verificar el token utilizando el secreto proporcionado.
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      // Si hay un error en la verificación, responder con un código 403.
      console.log('Error de verificación de token:', err.message);
      return next(403);
    }

    // Agregar el ID de usuario y el rol del usuario a la solicitud.
    req.userId = decodedToken.uid;
    req.userRole = decodedToken.role;

    // Imprimir información decodificada en la consola.
    console.log('Usuario autenticado:', decodedToken.uid, '- Rol:', decodedToken.role);

    // Continuar con el siguiente middleware.
    return next();
  });
};

module.exports.isAuthenticated = (req) => {
  const userId = req.userId ? req.userId.toString() : null;
  console.log(userId, 'midelware');
  if (userId) {
    console.log('Usuario autenticado:', userId);
    return true;
  }
  console.log('Usuario no autenticado');
  return false;

  // TODO: Decide based on the request information whether the user is authenticated
};

module.exports.isAdmin = (req) => {
  const userRole = req.userRole ? req.userRole.toString() : null;
  if (userRole === 'admin') {
    console.log('es administrador midelware', userRole);
    return true;
  }
  return false;
};

// TODO: Decide based on the request information whether the user is an admin

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
