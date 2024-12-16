// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { initiateGithubOAuth } from '../../services/githubAuth';
import { getAuthenticatedUserInfo, getUserRepositories, getUserRepositoriesWithToken } from '../../services/github';
import styles from './Profile.module.scss';

function Profile() {
  const { user } = useAuth();
  const [githubUser, setGithubUser] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favoriteRepos');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        if (localStorage.getItem('github_token')) {
          const repos = await getUserRepositoriesWithToken();
          setRepositories(repos);
        } else {
          const repos = await getUserRepositories(user.username);
          setRepositories(repos);
        }
      } catch (err) {

        if (err.response?.status === 401) {
          localStorage.removeItem('github_token');
          try {
            const repos = await getUserRepositories(user.username);
            setRepositories(repos);
            return;
          } catch (fallbackErr) {
            setError('Failed to fetch repositories. Please try connecting with GitHub again.');
          }
        } else {
          setError('Failed to fetch repositories: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };
  
    if (user?.username) {
      fetchRepositories();
    }
  }, [user?.username]);

  useEffect(() => {
    localStorage.setItem('favoriteRepos', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await getAuthenticatedUserInfo();
        setGithubUser(userInfo);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    if (localStorage.getItem('github_token')) {
      fetchUserData();
    }
  }, []);


  const toggleFavorite = (repoId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(repoId)) {
        return prevFavorites.filter(id => id !== repoId);
      }
      return [...prevFavorites, repoId];
    });
  };

  const handleGithubConnect = () => {
    initiateGithubOAuth();
  };

  const filteredRepos = repositories
    .filter(repo => 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!showFavoritesOnly || favorites.includes(repo.id))
    );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.githubConnect}>
          <p>If you don't see your repositories, you need to connect with your github account</p>
          <button onClick={handleGithubConnect} className={styles.githubButton}>
            Connect GitHub
          </button>
        </div>
      <div className={styles.header}>
        <h1>Welcome, {githubUser?.login || user?.username}!</h1>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchBar}
          />
          <button 
            className={`${styles.filterButton} ${showFavoritesOnly ? styles.active : ''}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            {showFavoritesOnly ? 'Show All' : 'Show Favorites'}
          </button>
        </div>
      </div>
      
      <div className={styles.repositories}>
        {filteredRepos.map(repo => (
          <div key={repo.id} className={styles.repo}>
            <h3>{repo.name}</h3>
            <p>{repo.description || ''}</p>
            <div className={styles.repoActions}>
              <a 
                href={repo.html_url} 
                className={styles.viewButton}
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Repository
              </a>
              <button 
                className={`${styles.starButton} ${favorites.includes(repo.id) ? styles.starred : ''}`}
                onClick={() => toggleFavorite(repo.id)}
              >
                {favorites.includes(repo.id) ? '★' : '☆'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;