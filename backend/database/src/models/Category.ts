import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { Course } from "./Course";

export interface CategoryAttributes {
  id: string;
  name: string;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, "id">;

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public name!: string;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: "categories"
  }
);

export const CourseCategory = sequelize.define(
  "CourseCategory",
  {
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    tableName: "course_categories"
  }
);

Course.belongsToMany(Category, { through: CourseCategory, foreignKey: "courseId", as: "categories" });
Category.belongsToMany(Course, { through: CourseCategory, foreignKey: "categoryId", as: "courses" });

