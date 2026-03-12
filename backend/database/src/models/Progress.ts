import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./User";
import { Lecture } from "./Lecture";

export interface ProgressAttributes {
  id: string;
  userId: string;
  lectureId: string;
  completed: boolean;
}

type ProgressCreationAttributes = Optional<ProgressAttributes, "id" | "completed">;

export class Progress
  extends Model<ProgressAttributes, ProgressCreationAttributes>
  implements ProgressAttributes
{
  public id!: string;
  public userId!: string;
  public lectureId!: string;
  public completed!: boolean;
}

Progress.init(
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
    lectureId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: "progress"
  }
);

Progress.belongsTo(User, { foreignKey: "userId", as: "user" });
Progress.belongsTo(Lecture, { foreignKey: "lectureId", as: "lecture" });

