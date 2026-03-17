import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { Section } from "./Section";

export interface LessonAttributes {
  id: string;
  sectionId: string;
  title: string;
  type: "video" | "article" | "quiz";
  content?: string | null;
  description?: string | null;
  videoId?: string | null;
  videoPlaybackId?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  status?: string | null;
  order: number;
}

type LessonCreationAttributes = Optional<LessonAttributes, "id" | "content" | "description" | "videoId" | "videoPlaybackId" | "videoUrl" | "duration" | "status">;

export class Lesson
  extends Model<LessonAttributes, LessonCreationAttributes>
  implements LessonAttributes {
  public id!: string;
  public sectionId!: string;
  public title!: string;
  public type!: "video" | "article" | "quiz";
  public content!: string | null;
  public description!: string | null;
  public videoId!: string | null;
  public videoPlaybackId!: string | null;
  public videoUrl!: string | null;
  public duration!: number | null;
  public status!: string | null;
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    videoId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "video_id"
    },
    videoPlaybackId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "video_playback_id"
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "video_url"
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "pending"
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
