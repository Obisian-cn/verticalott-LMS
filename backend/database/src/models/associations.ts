import { Course } from "./Course";
import { Lesson } from "./Lesson";
import { Section } from "./Section";
import { Video } from "./Video";
import { UserVideoProgress } from "./UserVideoProgress";
import { User } from "./User";

export function initAssociations() {
    Section.belongsTo(Course, { foreignKey: "courseId", as: "Course" });

    Course.hasMany(Section, {
        foreignKey: "courseId",
        as: "sections",
    });

    Section.hasMany(Lesson, {
        foreignKey: "sectionId",
        as: "lessons",
    });

    Lesson.belongsTo(Section, {
        foreignKey: "sectionId",
        as: "section",
    });

    Video.hasMany(Lesson, {
        foreignKey: "videoId",
        as: "lessons",
    });

    Lesson.belongsTo(Video, {
        foreignKey: "videoId",
        as: "video",
    });

    User.hasMany(UserVideoProgress, {
        foreignKey: "userId",
        as: "videoProgress",
    });

    UserVideoProgress.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });

    Video.hasMany(UserVideoProgress, {
        foreignKey: "videoId",
        as: "progress",
    });

    UserVideoProgress.belongsTo(Video, {
        foreignKey: "videoId",
        as: "video",
    });
}
