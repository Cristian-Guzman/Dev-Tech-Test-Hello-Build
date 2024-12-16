// src/services/github.js
import axios from 'axios';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

export const getUserRepositoriesWithToken = async () => {
  const token = localStorage.getItem('github_token');
  if (!token) throw new Error('No GitHub token found');

  try {
    const query = {
      query: `
        query { 
          viewer { 
            login
            repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                id
                name
                description
                url
                primaryLanguage {
                  name
                  color
                }
                isPrivate
                updatedAt
                stargazerCount
              }
            }
          }
        }
      `
    };

    const response = await axios.post(GITHUB_GRAPHQL_API, query, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.viewer.repositories.nodes;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

export const getAuthenticatedUserInfo = async () => {
    const token = localStorage.getItem('github_token');
    if (!token) throw new Error('No GitHub token found');
  
    try {
      const query = {
        query: `
          query { 
            viewer { 
              login
              name
            }
          }
        `
      };
  
      const response = await axios.post('https://api.github.com/graphql', query, {
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      return response.data.data.viewer;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

export const getGithubUserInfo = async (token) => {
    try {
      const query = {
        query: `
          query { 
            viewer { 
              login
              name
              email
            }
          }
        `
      };
  
      const response = await axios.post('https://api.github.com/graphql', query, {
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      return response.data.data.viewer;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

export const getUserRepositories = async (username) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};