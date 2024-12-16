// src/pages/GithubCallback/GithubCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './GithubCallback.module.scss';

function GithubCallback() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (token) {
          localStorage.setItem('github_token', token);
          setTimeout(() => {
            navigate('/profile', { replace: true });
          }, 100);
        } else {
          console.error('No token available');
          navigate('/profile', { replace: true });
        }
      } catch (error) {
        console.error('OAuth error:', error);
        navigate('/profile', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, updateUser]);

  return (
    <div className={styles.loading}>
      <p>Connecting to GitHub...</p>
    </div>
  );
}

export default GithubCallback;