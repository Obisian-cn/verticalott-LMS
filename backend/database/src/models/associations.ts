import { Course } from "./Course";
import { Lesson } from "./Lesson";
import { Section } from "./Section";

export function initAssociations() {
    Section.belongsTo(Course, { foreignKey: "courseId", as: "Course" });

    Section.hasMany(Lesson, {
        foreignKey: "sectionId",
        as: "lessons",
    });

    Lesson.belongsTo(Section, {
        foreignKey: "sectionId",
        as: "section",
    });
}
