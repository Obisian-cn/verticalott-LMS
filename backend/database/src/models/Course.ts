import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./User";

export type CourseStatus = "draft" | "published";

export interface CourseAttributes {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  price: number;
  status: CourseStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type CourseCreationAttributes = Optional<CourseAttributes, "id" | "status">;

export class Course
  extends Model<CourseAttributes, CourseCreationAttributes>
  implements CourseAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public instructorId!: string;
  public price!: number;
  public status!: CourseStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft"
    }
  },
  {
    sequelize,
    tableName: "courses"
  }
);

Course.belongsTo(User, { foreignKey: "instructorId", as: "instructor" });

