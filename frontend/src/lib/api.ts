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
    const res = await api.get(`/content/courses/${id}/sections`);
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
  updateProgress: async (data: { lessonId: string, completed: boolean }) => {
    const res = await api.post('/progress', data);
    return res.data;
  }
};
