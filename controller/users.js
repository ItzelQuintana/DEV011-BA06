module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const db = await connect();
      const users = await db.collection('usuarios').find().toArray();

      res.json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error.message);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  // TODO: Implement the necessary function to fetch the `users` collection or table

  initAdminUser: async () => {
    try {
      const { adminEmail, adminPassword } = config;

      if (!adminEmail || !adminPassword) {
        console.log('Configuración incompleta para el usuario administrador');
        return;
      }

      const db = await connect();
      const existingAdmin = await db.collection('usuarios').findOne({ email: adminEmail });

      if (!existingAdmin) {
        const adminUser = {
          email: adminEmail,
          password: bcrypt.hashSync(adminPassword, 10),
          roles: { admin: true },
        };

        await db.collection('usuarios').insertOne(adminUser);
        console.log('Usuario administrador creado con éxito');
      } else {
        console.log('Ya existe un usuario administrador en la base de datos');
      }

      await db.close();
    } catch (error) {
      console.error('Error al inicializar el usuario administrador:', error.message);
    }
  },

  // Otras funciones controladoras según sea necesario
};