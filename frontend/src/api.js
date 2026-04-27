import axios from 'axios';

const API = axios.create({
  baseURL: 'https://blog-app-qj7z.onrender.com/api'
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.authorization = token;
  }
  return req;
});

// Auth routes
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => API.post(`/auth/reset-password/${token}`, data);

// Blog routes
export const getBlogs = () => API.get('/blogs');
export const createBlog = (data) => API.post('/blogs', data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);