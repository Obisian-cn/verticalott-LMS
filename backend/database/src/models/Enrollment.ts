import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./User";
import { Course } from "./Course";

export interface EnrollmentAttributes {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
}

type EnrollmentCreationAttributes = Optional<EnrollmentAttributes, "id" | "enrolledAt">;

export class Enrollment
  extends Model<EnrollmentAttributes, EnrollmentCreationAttributes>
  implements EnrollmentAttributes
{
  public id!: string;
  public userId!: string;
  public courseId!: string;
  public enrolledAt!: Date;
}

Enrollment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    enrolledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: "enrollments"
  }
);

Enrollment.belongsTo(User, { foreignKey: "userId", as: "user" });
Enrollment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

