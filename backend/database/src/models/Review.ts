import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./User";
import { Course } from "./Course";

export interface ReviewAttributes {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment?: string | null;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, "id" | "comment">;

export class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public id!: string;
  public userId!: string;
  public courseId!: string;
  public rating!: number;
  public comment!: string | null;
}

Review.init(
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
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "reviews"
  }
);

Review.belongsTo(User, { foreignKey: "userId", as: "user" });
Review.belongsTo(Course, { foreignKey: "courseId", as: "course" });

