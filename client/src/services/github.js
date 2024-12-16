// src/services/github.js
import axios from 'axios';

const GITHUB_API = 'https://api.github.com/user/repos'; 

export const githubClient = axios.create({
  baseURL: GITHUB_API,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  }
});

export const getUserRepositories = async (username) => {
    try {
      const query = {
        query: `{
          user(login: "${username}") {
            repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                id
                name
                description
                url
                createdAt
                viewerCanAdminister
                primaryLanguage {
                  name
                  color
                }
              }
            }
          }
        }`
      };
  
      const response = await axios.post('https://api.github.com/graphql', query, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });
  
      return response.data.data.user.repositories.nodes;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  };

export const validateGithubUser = async (username) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };