import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (profileData) => API.put('/auth/profile', profileData);

export const fetchEvents = () => API.get('/events');

export const fetchMyEvents = () => API.get('/events/my');

export const createEvent = (newEvent) => API.post('/events', newEvent);

export const updateEvent = (id, updatedEvent) => API.put(`/events/${id}`, updatedEvent);

export const deleteEvent = (id) => API.delete(`/events/${id}`);

export const fetchUsers = () => API.get('/admin/users');

export const fetchAllRegistrations = () => API.get('/admin/registrations');

export const fetchOfficialEvents = () => API.get('/admin/events');
export const createOfficialEvent = (newEvent) => API.post('/admin/events', newEvent);
export const rescheduleOfficialEvent = (id, dateData) => API.put(`/admin/events/${id}`, dateData);
export const deleteOfficialEvent = (id) => API.delete(`/admin/events/${id}`);

