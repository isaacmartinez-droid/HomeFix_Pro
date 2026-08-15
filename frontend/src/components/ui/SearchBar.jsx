import React, { useState } from 'react';

const SearchBar = ({ placeholder = 'Buscar...', onSearch, filters = [] }) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch({ query, filter: activeFilter });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary-variant transition-colors cursor-pointer"
        >
          Buscar
        </button>
      </form>

      {filters.length > 0 && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-on-surface-variant font-label-sm text-label-sm">Filtrar:</span>
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(activeFilter === filter.value ? null : filter.value)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                activeFilter === filter.value
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
