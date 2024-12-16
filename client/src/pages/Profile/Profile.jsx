// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserRepositories } from '../../services/github';
import styles from './Profile.module.scss';

function Profile() {
  const { user } = useAuth();
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
        const repos = await getUserRepositories();
        setRepositories(repos);
      } catch (err) {
        setError('Failed to fetch repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteRepos', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (repoId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(repoId)) {
        return prevFavorites.filter(id => id !== repoId);
      }
      return [...prevFavorites, repoId];
    });
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
      <div className={styles.header}>
        <h1>Welcome, {user.username}!</h1>
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