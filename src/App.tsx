import React from 'react';
import { SearchForm } from './components/features/SearchForm/SearchForm';
import { TourList } from './components/features/TourList/TourList';
import { useSearch } from './hooks/useSearch';
import { useTours } from './hooks/useTours';
import type { SelectedDestination } from './models/types';
import './App.css';

function App() {
  const { state, run } = useSearch();

  const prices = state.status === 'success' ? state.prices : null;
  const countryId = state.status === 'success' ? state.countryId : null;
  const toursState = useTours(prices, countryId);

  const isLoading = state.status === 'loading' || toursState.status === 'loading';

  const handleSearch = (destination: SelectedDestination) => {
    run(destination);
  };

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

        {toursState.status === 'ready' && toursState.tours.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>За вашим запитом турів не знайдено</p>
          </div>
        )}

        {toursState.status === 'ready' && toursState.tours.length > 0 && (
          <section className="results">
            <h2 className="results-title">
              Знайдено турів: {toursState.tours.length}
            </h2>
            <TourList tours={toursState.tours} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
