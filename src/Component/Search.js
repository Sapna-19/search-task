// src/components/Search.js
import React, { useState, useEffect } from 'react';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = async () => {
    if (!query) {
      setError('Please enter a search query.');
      return;
    }

    try {
      let apiUrl = `https://api.github.com/search/repositories?q=${query}&per_page=30&page=${page}`;
      if (sortBy) {
        apiUrl += `&sort=${sortBy}`;
        if (sortBy === 'watchers') {
          // Add the 'order' parameter for watchers sorting
          apiUrl += '&order=desc';
        }
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (page === 1) {
        setRepos(data.items);
      } else {
        // Concatenate new results with existing results
        setRepos([...repos, ...data.items]);
      }

      setError(''); // Clear any previous error
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data.');
    }
  };

  // Load more results when the page changes
  useEffect(() => {
    handleSearch();
  }, [page]);

  const handleSortChange = (event) => {
    const selectedSortBy = event.target.value;
    setSortBy(selectedSortBy);
    setPage(1); // Reset page to 1 when sorting changes

    if (repos.length > 0) {
      // Sort the existing repos based on the selected field
      const sortedRepos = repos.slice().sort((a, b) => {
        if (selectedSortBy === 'created_at') {
          return new Date(a.created_at) - new Date(b.created_at);
        } else if (selectedSortBy === 'updated_at') {
          return new Date(a.updated_at) - new Date(b.updated_at);
        } else if (selectedSortBy === 'watchers') {
          return a.watchers - b.watchers;
        } else {
          return 0; // No sorting for other fields
        }
      });
      setRepos(sortedRepos);
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
        onChange={handleSortChange}
      >
        <option value="">Sort by</option>
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
            {/* <p className="repo-language">Created: {repo.created_at}</p>
            <p className="repo-language">Updated: {repo.updated_at}</p>
            <p className="repo-language">Score: {repo.score}</p>
            <p className="repo-language">Watchers: {repo.watchers}</p> */}
          </div>
        ))}
      </div>
      <button
        className="load-more-button"
        onClick={() => setPage(page + 1)}
      >
        Load More
      </button>
    </div>
  );
}

export default Search;
