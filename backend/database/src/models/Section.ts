import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { Course } from "./Course";

export interface SectionAttributes {
  id: string;
  courseId: string;
  title: string;
  order: number;
}

type SectionCreationAttributes = Optional<SectionAttributes, "id">;

export class Section
  extends Model<SectionAttributes, SectionCreationAttributes>
  implements SectionAttributes
{
  public id!: string;
  public courseId!: string;
  public title!: string;
  public order!: number;
}

Section.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "sections"
  }
);

Section.belongsTo(Course, { foreignKey: "courseId", as: "course" });

