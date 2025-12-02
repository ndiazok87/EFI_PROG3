module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('password_resets', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false },
      user_id: { type: Sequelize.STRING(36), allowNull: false },
      token: { type: Sequelize.STRING, allowNull: false, unique: true },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      used: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addConstraint('password_resets', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'password_resets_user_fkey',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('password_resets', 'password_resets_user_fkey');
    await queryInterface.dropTable('password_resets');
  }
};
