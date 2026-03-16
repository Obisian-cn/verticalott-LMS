import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { Section } from "./Section";

export interface LessonAttributes {
  id: string;
  sectionId: string;
  title: string;
  type: "video" | "article" | "quiz";
  content?: string | null;
  videoId?: string | null;
  order: number;
}

type LessonCreationAttributes = Optional<LessonAttributes, "id" | "content" | "videoId">;

export class Lesson
  extends Model<LessonAttributes, LessonCreationAttributes>
  implements LessonAttributes
{
  public id!: string;
  public sectionId!: string;
  public title!: string;
  public type!: "video" | "article" | "quiz";
  public content!: string | null;
  public videoId!: string | null;
  public order!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly Section?: Section;
}

Lesson.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "section_id"
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("video", "article", "quiz"),
      allowNull: false,
      defaultValue: "video"
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    videoId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "video_id"
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "lessons",
    underscored: true
  }
);

Lesson.belongsTo(Section, { foreignKey: "sectionId", as: "Section" });
