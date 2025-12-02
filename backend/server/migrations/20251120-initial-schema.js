/**
 * Initial schema migration for Cultivador Pro
 * Creates users, profiles, plots, activities, resources, workers, activity_assignments
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false, defaultValue: Sequelize.UUIDV4 },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      raw_user_meta_data: { type: Sequelize.JSON, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    // profiles
    await queryInterface.createTable('profiles', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false },
      nombre: { type: Sequelize.TEXT, allowNull: false },
      correo: { type: Sequelize.TEXT, allowNull: false, unique: true },
      rol: { type: Sequelize.ENUM('admin', 'gestor', 'trabajador'), allowNull: false, defaultValue: 'trabajador' },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    // plots
    await queryInterface.createTable('plots', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false, defaultValue: Sequelize.UUIDV4 },
      nombre: { type: Sequelize.TEXT, allowNull: false },
      superficie: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      tipo_cultivo: { type: Sequelize.ENUM('maiz','trigo','soja','girasol','otro'), allowNull: false },
      estado: { type: Sequelize.ENUM('sembrado','cosechado','en preparacion'), allowNull: false, defaultValue: 'en preparacion' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    // activities
    await queryInterface.createTable('activities', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false, defaultValue: Sequelize.UUIDV4 },
      nombre: { type: Sequelize.TEXT, allowNull: false },
      tipo: { type: Sequelize.ENUM('siembra','cosecha','fertilizacion','riego','fumigacion'), allowNull: false },
      id_parcela: { type: Sequelize.STRING(36), allowNull: false },
      fecha_inicio: { type: Sequelize.DATEONLY, allowNull: false },
      fecha_fin: { type: Sequelize.DATEONLY, allowNull: false },
      estado: { type: Sequelize.ENUM('pendiente','en progreso','completada'), allowNull: false, defaultValue: 'pendiente' },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    // resources
    await queryInterface.createTable('resources', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false, defaultValue: Sequelize.UUIDV4 },
      tipo: { type: Sequelize.ENUM('maquinaria','fertilizantes','semillas','herramientas'), allowNull: false },
      nombre: { type: Sequelize.STRING, allowNull: false },
      cantidad: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      id_parcela: { type: Sequelize.STRING(36), allowNull: true },
      disponible: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    // workers
    await queryInterface.createTable('workers', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false, defaultValue: Sequelize.UUIDV4 },
      especialidad: { type: Sequelize.TEXT, allowNull: false },
      id_usuario: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      activo: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    // activity_assignments
    await queryInterface.createTable('activity_assignments', {
      id: { type: Sequelize.STRING(36), primaryKey: true, allowNull: false, defaultValue: Sequelize.UUIDV4 },
      id_actividad: { type: Sequelize.STRING(36), allowNull: false },
      id_trabajador: { type: Sequelize.STRING(36), allowNull: false },
      asignado_en: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    // Add simple foreign keys where appropriate (no cascade by default)
    await queryInterface.addConstraint('profiles', {
      fields: ['id'],
      type: 'foreign key',
      name: 'profiles_user_id_fkey',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('plots', {
      fields: ['id'],
      type: 'primary key',
      name: 'plots_pkey'
    });

    await queryInterface.addConstraint('activities', {
      fields: ['id_parcela'],
      type: 'foreign key',
      name: 'activities_plot_fkey',
      references: { table: 'plots', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('resources', {
      fields: ['id_parcela'],
      type: 'foreign key',
      name: 'resources_plot_fkey',
      references: { table: 'plots', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('workers', {
      fields: ['id_usuario'],
      type: 'foreign key',
      name: 'workers_profile_fkey',
      references: { table: 'profiles', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('activity_assignments', {
      fields: ['id_actividad'],
      type: 'foreign key',
      name: 'assignments_activity_fkey',
      references: { table: 'activities', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('activity_assignments', {
      fields: ['id_trabajador'],
      type: 'foreign key',
      name: 'assignments_worker_fkey',
      references: { table: 'workers', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('activity_assignments', 'assignments_worker_fkey');
    await queryInterface.removeConstraint('activity_assignments', 'assignments_activity_fkey');
    await queryInterface.removeConstraint('workers', 'workers_profile_fkey');
    await queryInterface.removeConstraint('resources', 'resources_plot_fkey');
    await queryInterface.removeConstraint('activities', 'activities_plot_fkey');
    await queryInterface.removeConstraint('profiles', 'profiles_user_id_fkey');

    await queryInterface.dropTable('activity_assignments');
    await queryInterface.dropTable('workers');
    await queryInterface.dropTable('resources');
    await queryInterface.dropTable('activities');
    await queryInterface.dropTable('plots');
    await queryInterface.dropTable('profiles');
    await queryInterface.dropTable('users');
  }
};
