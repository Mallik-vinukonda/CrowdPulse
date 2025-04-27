import axios from 'axios';

// Use import.meta.env for Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export async function login(email, password) {
  const { data } = await axios.post(`${API_URL}/api/user/login`, { email, password });
  setAuthToken(data.token);
  return data;
}

export async function register(name, email, password) {
  const { data } = await axios.post(`${API_URL}/api/user/register`, { name, email, password });
  return data;
}

export async function getProfile() {
  const { data } = await axios.get(`${API_URL}/api/user/me`);
  return data;
}

export async function submitIssue(formData) {
  const { data } = await axios.post(`${API_URL}/issue`, formData);
  return data;
}

export async function getMyIssues() {
  const { data } = await axios.get(`${API_URL}/issue/mine`);
  return data;
}

export async function getCredits() {
  const { data } = await axios.get(`${API_URL}/api/credit/me`);
  return data;
}

export async function redeemCredits(credits, payoutMethod) {
  const { data } = await axios.post(`${API_URL}/credit/redeem`, { credits, payoutMethod });
  return data;
}

export async function getCourses() {
  const { data } = await axios.get(`${API_URL}/course`);
  return data;
}

export async function unlockCourse(id) {
  const { data } = await axios.post(`${API_URL}/course/${id}/unlock`);
  return data;
}

export async function getMyCourses() {
  const { data } = await axios.get(`${API_URL}/course/mine`);
  return data;
}

export async function getPendingIssues() {
  const { data } = await axios.get(`${API_URL}/issue?status=pending`);
  return data;
}

export async function reviewIssue(id, status) {
  const { data } = await axios.post(`${API_URL}/issue/${id}/review`, { status });
  return data;
}
