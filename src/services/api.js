
import config from '../config';

const BASE_URL = config.apiBaseUrl;

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get multipart headers
  getMultipartHeaders() {
    const token = localStorage.getItem('token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request('/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async requestOtp(email) {
    return this.request('/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email) {
    return this.request('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword({ token, password }) {
    return this.request(`/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async verifyToken() {
    return this.request('/verify-token');
  }

  // Employee methods
  async getEmployees() {
    return this.request('/admin/allemployees');
  }

  async addEmployee(employeeData) {
    const formData = new FormData();
    
    Object.entries(employeeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    return this.request('/admin/addemployees', {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    });
  }

  async updateEmployee(employeeId, employeeData) {
    const formData = new FormData();
    
    Object.entries(employeeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    return this.request(`/admin/editemployees/${employeeId}`, {
      method: 'PUT',
      headers: this.getMultipartHeaders(),
      body: formData,
    });
  }

  async deleteEmployee(employeeId) {
    return this.request(`/admin/deleteemployees/${employeeId}`, {
      method: 'DELETE',
    });
  }

  // Task methods
  async getTasks() {
    return this.request('/tasks');
  }

  async getAdminTasks() {
    return this.request('/admin/tasks');
  }

  async createTask(taskData) {
    const formData = new FormData();
    
    // Handle basic fields
    Object.entries(taskData).forEach(([key, value]) => {
      if (key === 'assignedTo' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'files' && Array.isArray(value)) {
        value.forEach(file => {
          formData.append('files', file);
        });
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    return this.request('/admin/createtask', {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    });
  }

  async updateTask(taskId, taskData) {
    const formData = new FormData();
    
    Object.entries(taskData).forEach(([key, value]) => {
      if (key === 'assignedTo' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'files' && Array.isArray(value)) {
        value.forEach(file => {
          formData.append('files', file);
        });
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    return this.request(`/tasks/update/${taskId}`, {
      method: 'PATCH',
      headers: this.getMultipartHeaders(),
      body: formData,
    });
  }

  async deleteTask(taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async updateTaskStatus(taskId, status) {
    return this.request(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Profile methods
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(profileData) {
    const formData = new FormData();

    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    return this.request('/profile', {
      method: 'PUT',
      headers: this.getMultipartHeaders(),
      body: formData,
    });
  }

  // Auction Task methods
  async getAuctionTasks(page = 1, limit = 30) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request(`/get/auction-tasks?${queryParams}`);
  }

  async updateAuctionTask(taskId, taskData) {
    return this.request(`/auction-tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteAuctionTask(taskId) {
    return this.request(`/delete/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Category methods
  async createCategory(categoryData) {
    return this.request('/create-category', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async getCategories(categoryType) {
    const query = categoryType ? `?categoryType=${encodeURIComponent(categoryType)}` : '';
    return this.request(`/get-categories${query}`);
  }

  // Vehicle type methods
  async createVehicleType(vehicleData) {
    return this.request('/create-vehicle-type', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async getVehicleTypes() {
    return this.request('/get-vehicle-types');
  }
}

export default new ApiService();