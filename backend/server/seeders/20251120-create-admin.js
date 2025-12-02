const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const id = uuidv4();
    const passwordHash = bcrypt.hashSync('admin123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id,
        email: 'admin@example.com',
        password_hash: passwordHash,
        raw_user_meta_data: JSON.stringify({ nombre: 'Admin', rol: 'admin' }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('profiles', [
      {
        id,
        nombre: 'Admin',
        correo: 'admin@example.com',
        rol: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('profiles', { correo: 'admin@example.com' });
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' });
  },
};
