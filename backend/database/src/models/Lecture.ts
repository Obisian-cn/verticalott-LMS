import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { Section } from "./Section";

export interface LectureAttributes {
  id: string;
  sectionId: string;
  title: string;
  muxPlaybackId?: string | null;
  duration?: number | null;
  order: number;
}

type LectureCreationAttributes = Optional<LectureAttributes, "id" | "muxPlaybackId" | "duration">;

export class Lecture
  extends Model<LectureAttributes, LectureCreationAttributes>
  implements LectureAttributes
{
  public id!: string;
  public sectionId!: string;
  public title!: string;
  public muxPlaybackId!: string | null;
  public duration!: number | null;
  public order!: number;
}

Lecture.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    muxPlaybackId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "lectures"
  }
);

Lecture.belongsTo(Section, { foreignKey: "sectionId", as: "section" });

