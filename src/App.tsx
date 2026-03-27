import React from 'react';
import { SearchForm } from './components/features/SearchForm/SearchForm';
import { useSearch } from './hooks/useSearch';
import type { SelectedDestination } from './models/types';
import './App.css';

function App() {
  const { state, run } = useSearch();

  const handleSearch = (destination: SelectedDestination) => {
    run(destination);
  };

  const isLoading = state.status === 'loading';

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Пошук турів</h1>
      </header>
      <main className="app-main">
        <SearchForm onSearch={handleSearch} loading={isLoading} />

        {isLoading && (
          <div className="loader-wrapper">
            <div className="loader" />
            <span className="loader-text">Шукаємо тури...</span>
          </div>
        )}

        {state.status === 'error' && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>{state.message}</p>
          </div>
        )}

        {state.status === 'success' && Object.keys(state.prices).length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>За вашим запитом турів не знайдено</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
