import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { Lecture } from "./Lecture";

export type VideoStatus = "pending" | "ready" | "errored";

export interface VideoAssetAttributes {
  id: string;
  lectureId: string;
  muxAssetId: string;
  playbackId: string;
  status: VideoStatus;
}

type VideoAssetCreationAttributes = Optional<VideoAssetAttributes, "id" | "status">;

export class VideoAsset
  extends Model<VideoAssetAttributes, VideoAssetCreationAttributes>
  implements VideoAssetAttributes
{
  public id!: string;
  public lectureId!: string;
  public muxAssetId!: string;
  public playbackId!: string;
  public status!: VideoStatus;
}

VideoAsset.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    lectureId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    muxAssetId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    playbackId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "ready", "errored"),
      allowNull: false,
      defaultValue: "pending"
    }
  },
  {
    sequelize,
    tableName: "video_assets"
  }
);

VideoAsset.belongsTo(Lecture, { foreignKey: "lectureId", as: "lecture" });

