import axios from 'axios';

const API_URL = 'http://api.activitymessenger.local/v1'; // Better to put that in a .env

export default {
  getBoards() {
    return axios.get(`${API_URL}/boards`);
  },
  createBoard(data) {
    return axios.post(`${API_URL}/boards`, data);
  },
  updateBoard(id, data) {
    return axios.put(`${API_URL}/boards/${id}`, data);
  },
  deleteBoard(id) {
    return axios.delete(`${API_URL}/boards/${id}`);
  },
  // Pour les tâches :
  createTask(boardId, data) {
    return axios.post(`${API_URL}/boards/${boardId}/tasks`, data);
  },
  updateTask(boardId, taskId, data) {
    console.log(boardId, taskId, data);
    return axios.patch(`${API_URL}/boards/${boardId}/tasks/${taskId}`, data);
  },
  deleteTask(boardId, taskId) {
    return axios.delete(`${API_URL}/boards/${boardId}/tasks/${taskId}`);
  },
  toggleTaskCompleted(boardId, taskId, completed) {
    return axios.patch(`${API_URL}/boards/${boardId}/tasks/${taskId}`, { completed });
  },
};
