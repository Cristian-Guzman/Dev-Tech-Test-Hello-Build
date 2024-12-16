// src/services/github.js
import axios from 'axios';

const GITHUB_API = 'https://api.github.com/user/repos'; // This is the correct REST API endpoint

console.log(import.meta.env.VITE_GITHUB_TOKEN);
export const githubClient = axios.create({
  baseURL: GITHUB_API,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  }
});

export const getUserRepositories = async () => {
  try {
    const response = await githubClient.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};