import React from 'react';
import { SearchForm } from './components/features/SearchForm/SearchForm';
import type { SelectedDestination } from './models/types';
import './App.css';

function App() {
  const handleSearch = (destination: SelectedDestination) => {
    console.log('search', destination);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Пошук турів</h1>
      </header>
      <main className="app-main">
        <SearchForm onSearch={handleSearch} loading={false} />
      </main>
    </div>
  );
}

export default App;
