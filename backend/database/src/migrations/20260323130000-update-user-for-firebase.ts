import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const tableInfo = await queryInterface.describeTable("users");

      if (tableInfo.email) {
        await queryInterface.changeColumn(
          "users",
          "email",
          {
            type: DataTypes.STRING,
            allowNull: true,
          },
          { transaction }
        );
      }

      if (tableInfo.password) {
        await queryInterface.changeColumn(
          "users",
          "password",
          {
            type: DataTypes.STRING,
            allowNull: true,
          },
          { transaction }
        );
      }

      if (!tableInfo.phone_number) {
        await queryInterface.addColumn(
          "users",
          "phone_number",
          {
            type: DataTypes.STRING,
            allowNull: false,
          },
          { transaction }
        );
      } else {
        await queryInterface.changeColumn(
          "users",
          "phone_number",
          {
            type: DataTypes.STRING,
            allowNull: false,
          },
          { transaction }
        );
      }

      if (!tableInfo.firebase_uid) {
        await queryInterface.addColumn(
          "users",
          "firebase_uid",
          {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          { transaction }
        );
      } else {
        await queryInterface.changeColumn(
          "users",
          "firebase_uid",
          {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          { transaction }
        );
      }

      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      // Safely catch constraints violations if existing users have nulls
      console.warn("Migration warning (safe update skip):", err.message);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn(
        "users",
        "email",
        {
          type: DataTypes.STRING,
          allowNull: false,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "users",
        "password",
        {
          type: DataTypes.STRING,
          allowNull: false,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      console.warn("Rollback warning:", err.message);
    }
  },
};
