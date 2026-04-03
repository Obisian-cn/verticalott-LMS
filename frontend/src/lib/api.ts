import axios from 'axios';

// Base API instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Calls Object exported for react-query
export const apiMethods = {
  // Auth
  login: async (data: any) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  register: async (data: any) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  me: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  // Courses
  getCourses: async () => {
    const res = await api.get('/courses');
    return res.data;
  },
  getCourseById: async (id: string) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },
  getCourseContent: async (id: string) => {
    const res = await api.get(`/lesson/courses/${id}/curriculum`);
    if (res.data?.data && !Array.isArray(res.data.data) && res.data.data.sections) {
      res.data.data = res.data.data.sections;
    }
    return res.data; // Includes sections and lessons
  },

  // User features
  getEnrollments: async (userId: string) => {
    const res = await api.get(`/enrollments/users/${userId}/enrollments`);
    return res.data;
  },
  getProgress: async (courseId: string) => {
    const res = await api.get(`/progress/courses/${courseId}/progress`);
    return res.data;
  },
  updateProgress: async (data: { videoId: string, completed: boolean }) => {
    const res = await api.post('/progress', data);
    return res.data;
  },

  // Admin / Instructor missing methods
  createCourse: async (data: any) => {
    const res = await api.post('/courses', data);
    return res.data;
  },
  updateCourse: async (id: string, data: any) => {
    const res = await api.put(`/courses/${id}`, data);
    return res.data;
  },
  deleteCourse: async (id: string) => {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  },
  createSection: async (courseId: string, data: any) => {
    // const res = await api.post(`/content/courses/${courseId}/sections`, data);
    const res = await api.post(`/content/sections`, data);

    return res.data;
  },
  createLesson: async (sectionId: string, data: any) => {
    const res = await api.post(`/lesson/${sectionId}/lessons`, data);
    return res.data;
  },
  createMultipartLesson: async (sectionId: string, formData: FormData) => {
    const res = await api.post(`/lesson/${sectionId}/lessons`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getCurriculum: async (courseId: string) => {
    const res = await api.get(`/lesson/courses/${courseId}/curriculum`);
    if (res.data?.data && !Array.isArray(res.data.data) && res.data.data.sections) {
      res.data.data = res.data.data.sections;
    }
    return res.data;
  },
  uploadVideo: async (file: File, title: string, description?: string) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    if (description) formData.append('description', description);
    const res = await api.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  uploadPdf: async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    const res = await api.post('/lesson/upload/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getVideos: async () => {
    const res = await api.get('/videos');
    return res.data;
  },
  enroll: async (courseId: string) => {
    const res = await api.post('/enrollments', { courseId });
    return res.data;
  },
  createPayment: async (courseId: string, amount: number) => {
    const res = await api.post('/payments/create', { courseId, amount, provider: 'cashfree' });
    return res.data;
  }
};
