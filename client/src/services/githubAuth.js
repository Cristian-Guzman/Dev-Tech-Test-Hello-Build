// src/services/githubAuth.js
import axios from 'axios';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const REDIRECT_URI = `${window.location.origin}/callback`;

export const initiateGithubOAuth = () => {
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
  window.location.href = githubUrl;
};

export const validateGithubUser = async (username) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};