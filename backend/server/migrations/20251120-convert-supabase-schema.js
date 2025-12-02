"use strict";

/**
 * Converted from supabase SQL migrations (20251117...)
 * - Creates enums and tables: profiles, plots, activities, resources, workers, activity_assignments
 * - Does NOT recreate RLS policies or auth triggers (those are implemented in app layer)
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;

    // Create tables in order that respects FKs
    await queryInterface.createTable('profiles', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      nombre: { type: DataTypes.TEXT, allowNull: false },
      correo: { type: DataTypes.TEXT, allowNull: false, unique: true },
      rol: { type: DataTypes.ENUM('admin', 'gestor', 'trabajador'), allowNull: false, defaultValue: 'trabajador' },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.createTable('plots', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      nombre: { type: DataTypes.TEXT, allowNull: false },
      superficie: { type: DataTypes.DECIMAL(10,2), allowNull: false },
      tipo_cultivo: { type: DataTypes.ENUM('maiz','trigo','soja','girasol','otro'), allowNull: false },
      estado: { type: DataTypes.ENUM('sembrado','cosechado','en preparacion'), allowNull: false, defaultValue: 'en preparacion' },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.createTable('activities', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      nombre: { type: DataTypes.TEXT, allowNull: false },
      tipo: { type: DataTypes.ENUM('siembra','cosecha','fertilizacion','riego','fumigacion'), allowNull: false },
      id_parcela: { type: DataTypes.UUID, allowNull: false, references: { model: 'plots', key: 'id' }, onDelete: 'CASCADE' },
      fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
      fecha_fin: { type: DataTypes.DATEONLY, allowNull: false },
      estado: { type: DataTypes.ENUM('pendiente','en progreso','completada'), allowNull: false, defaultValue: 'pendiente' },
      descripcion: { type: DataTypes.TEXT },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // Add CHECK constraint for fecha_fin >= fecha_inicio where supported
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE activities ADD CONSTRAINT valid_dates CHECK (fecha_fin >= fecha_inicio)`
      );
    } catch (e) {
      // Not all dialects support CHECK via raw ALTER; ignore if fails
    }

    await queryInterface.createTable('resources', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      tipo: { type: DataTypes.ENUM('maquinaria','fertilizantes','semillas','herramientas'), allowNull: false },
      nombre: { type: DataTypes.TEXT, allowNull: false },
      cantidad: { type: DataTypes.INTEGER, allowNull: false },
      id_parcela: { type: DataTypes.UUID, allowNull: true, references: { model: 'plots', key: 'id' }, onDelete: 'SET NULL' },
      disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // Enforce cantidad >= 0 where supported
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE resources ADD CONSTRAINT cantidad_non_negative CHECK (cantidad >= 0)`
      );
    } catch (e) {}

    await queryInterface.createTable('workers', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      especialidad: { type: DataTypes.TEXT, allowNull: false },
      id_usuario: { type: DataTypes.UUID, allowNull: false, unique: true, references: { model: 'profiles', key: 'id' }, onDelete: 'CASCADE' },
      activo: { type: DataTypes.BOOLEAN, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.createTable('activity_assignments', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      id_actividad: { type: DataTypes.UUID, allowNull: false, references: { model: 'activities', key: 'id' }, onDelete: 'CASCADE' },
      id_trabajador: { type: DataTypes.UUID, allowNull: false, references: { model: 'workers', key: 'id' }, onDelete: 'CASCADE' },
      asignado_en: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    }, {
      uniqueKeys: {
        activity_worker_unique: {
          fields: ['id_actividad','id_trabajador']
        }
      }
    });

    // Ensure cantidad has default and non-negative via application layer as well
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order
    await queryInterface.dropTable('activity_assignments');
    await queryInterface.dropTable('workers');
    await queryInterface.dropTable('resources');
    await queryInterface.dropTable('activities');
    await queryInterface.dropTable('plots');
    await queryInterface.dropTable('profiles');

    // Try to drop enums (Postgres). Ignore errors for other dialects.
    try {
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_profiles_rol" CASCADE`);
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_plots_tipo_cultivo" CASCADE`);
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_plots_estado" CASCADE`);
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_activities_tipo" CASCADE`);
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_activities_estado" CASCADE`);
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_resources_tipo" CASCADE`);
    } catch (e) {}
  }
};
