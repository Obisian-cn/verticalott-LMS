import { DataTypes, Model, Optional } from "sequelize";
import { sequelize, User, Course } from "@lms/database";

export interface PaymentAttributes {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PaymentCreationAttributes = Optional<PaymentAttributes, "id" | "status" | "createdAt" | "updatedAt">;

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public userId!: string;
  public courseId!: string;
  public amount!: number;
  public currency!: string;
  public status!: "pending" | "completed" | "failed";
  public provider!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
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
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "USD",
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "payments",
  }
);

// Setup associations
// Ideally this would be centralized, but here we can define them locally
User.hasMany(Payment, { foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

Course.hasMany(Payment, { foreignKey: "courseId" });
Payment.belongsTo(Course, { foreignKey: "courseId" });

export default Payment;
