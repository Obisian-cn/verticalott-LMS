export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
}

export interface CourseDTO {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  price: number;
  status: "draft" | "published";
}

export interface EnrollmentDTO {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
}

