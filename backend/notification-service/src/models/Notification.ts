import { DataTypes, Model, Optional } from "sequelize";
import { sequelize, User } from "@lms/database";

export interface NotificationAttributes {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NotificationCreationAttributes = Optional<NotificationAttributes, "id" | "read" | "createdAt" | "updatedAt">;

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string;
  public userId!: string;
  public type!: string;
  public message!: string;
  public read!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "notifications",
  }
);

User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

export default Notification;
