import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
