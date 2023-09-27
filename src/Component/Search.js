// src/components/Search.js
import React, { useState } from 'react';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [sortBy, setSortBy] = useState('stars');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) {
      setError('Please enter a search query.');
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${query}&sort=${sortBy}`
      );
      const data = await response.json();
      setRepos(data.items);
      setError(''); // Clear any previous error
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data.');
    }
  };

  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search for repositories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select
        className="search-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="stars">Stars</option>
        <option value="watchers">Watchers</option>
        <option value="score">Score</option>
        <option value="name">Name</option>
        <option value="created_at">Created At</option>
        <option value="updated_at">Updated At</option>
      </select>
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="repo-list">
        {repos.map((repo) => (
          <div className="repo-card" key={repo.id}>
            <img
              className="repo-avatar"
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              width="50"
            />
            <h2 className="repo-name">{repo.name}</h2>
            <p className="repo-stars">Stars: {repo.stargazers_count}</p>
            <p className="repo-description">Description: {repo.description}</p>
            <p className="repo-language">Language: {repo.language}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
