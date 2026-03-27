import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface VideoAttributes {
  id: string;
  title: string;
  description?: string | null;
  playbackId?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  instructorId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type VideoCreationAttributes = Optional<VideoAttributes, "id">;

export class Video
  extends Model<VideoAttributes, VideoCreationAttributes>
  implements VideoAttributes
{
  public id!: string;
  public title!: string;
  public description!: string | null;
  public playbackId!: string | null;
  public videoUrl!: string | null;
  public duration!: number | null;
  public instructorId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Video.init(
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
      allowNull: true
    },
    playbackId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "playback_id"
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
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "instructor_id"
    }
  },
  {
    sequelize,
    tableName: "videos",
    underscored: true
  }
);
