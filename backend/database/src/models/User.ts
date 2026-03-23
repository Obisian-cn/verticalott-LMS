import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export type UserRole = "student" | "instructor" | "admin";

export interface UserAttributes {
  id: string;
  name: string;
  email?: string | null;
  password?: string | null;
  role: UserRole;
  phoneNumber?: string | null;
  firebaseUid?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "role">;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string | null;
  public password!: string | null;
  public role!: UserRole;
  public phoneNumber!: string | null;
  public firebaseUid!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM("student", "instructor", "admin"),
      allowNull: false,
      defaultValue: "student"
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "phone_number"
    },
    firebaseUid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "firebase_uid"
    }
  },
  {
    sequelize,
    tableName: "users",
    underscored: true
  }
);

