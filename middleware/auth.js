const jwt = require('jsonwebtoken');

// Middleware de autenticación que verifica la identidad del usuario utilizando decodeToken.uid
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
  // Obtener el ID de usuario y el rol de la solicitud.
  const userId = req.userId ? req.userId.toString() : null;
  const userRole = req.userRole;

  // Imprimir información en la consola para propósitos de depuración.
  console.log('Usuario ID:', userId, 'middleware');
  console.log('Rol del usuario:', userRole, 'middleware');

  // Verificar si hay un ID de usuario y un rol válidos.
  if (userId && userRole) {
    // Si hay un ID de usuario y un rol, el usuario está autenticado.
    console.log('Usuario autenticado:', userId);
    return true;
  }

  // Si no hay un ID de usuario o un rol, el usuario no está autenticado.
  console.log('Usuario no autenticado');
  return false;
};

module.exports.isAdmin = (req) => {
  const userRole = req.userRole ? req.userRole.toString() : null;
  if (userRole === 'admin') {
    console.log('Es administrador middleware', userRole);
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
