import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface UserVideoProgressAttributes {
  id: string;
  userId: string;
  videoId: string;
  completed: boolean;
  progressSeconds: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserVideoProgressCreationAttributes = Optional<UserVideoProgressAttributes, "id" | "completed" | "progressSeconds">;

export class UserVideoProgress
  extends Model<UserVideoProgressAttributes, UserVideoProgressCreationAttributes>
  implements UserVideoProgressAttributes
{
  public id!: string;
  public userId!: string;
  public videoId!: string;
  public completed!: boolean;
  public progressSeconds!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserVideoProgress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id"
    },
    videoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "video_id"
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    progressSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: "progress_seconds"
    }
  },
  {
    sequelize,
    tableName: "user_video_progress",
    underscored: true
  }
);
