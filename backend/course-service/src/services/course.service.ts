import { Course } from "../models";
import { AppError } from "../utils/AppError";

export class CourseService {
  public async createCourse(requestUserId: string, data: any) {
    const finalInstructorId = data.instructorId || requestUserId;
    const course = await Course.create({ ...data, instructorId: finalInstructorId });
    return course;
  }

  public async getCourses() {
    return await Course.findAll();
  }

  public async getCourseById(id: string) {
    const course = await Course.findByPk(id);
    if (!course) throw new AppError("Course not found", 404);
    return course;
  }

  public async updateCourse(id: string, instructorId: string, role: string, updateData: any) {
    const course = await Course.findByPk(id);
    if (!course) throw new AppError("Course not found", 404);

    if (role !== "admin" && course.instructorId !== instructorId) {
      throw new AppError("Forbidden: Only the instructor or admin can update this course", 403);
    }

    await course.update(updateData);
    return course;
  }

  public async deleteCourse(id: string, instructorId: string, role: string) {
    const course = await Course.findByPk(id);
    if (!course) throw new AppError("Course not found", 404);
    
    if (role !== "admin" && course.instructorId !== instructorId) {
      throw new AppError("Forbidden: Only the instructor or admin can delete this course", 403);
    }

    await course.destroy();
    return { success: true };
  }
}
