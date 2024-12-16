// src/pages/GithubCallback/GithubCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GithubCallback.module.scss';

function GithubCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get('code');

      if (code) {
        try {
          localStorage.setItem('github_token', code);
          navigate('/profile');
        } catch (error) {
          console.error('OAuth error:', error);
          navigate('/profile');
        }
      } else {
        navigate('/profile');
      }
    };

    handleCallback();
  }, [navigate]);

  return <div className={styles.loading}>Connecting to GitHub...</div>;
}

export default GithubCallback;