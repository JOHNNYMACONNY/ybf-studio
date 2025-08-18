import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { AdvancedButton } from './AdvancedButton';

export interface SearchFilter {
  id: string;
  label: string;
  type: 'select' | 'range' | 'checkbox' | 'radio';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  value?: string | number | boolean;
}

interface AdvancedSearchProps {
  placeholder?: string;
  onSearch: (query: string, filters: Record<string, string | number | boolean>) => void;
  filters?: SearchFilter[];
  className?: string;
  showFilters?: boolean;
  loading?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  placeholder = 'Search...',
  onSearch,
  filters = [],
  className = '',
  showFilters = true,
  loading = false
}) => {
  const [query, setQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string | number | boolean>>({});
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Update hasActiveFilters when activeFilters changes
  useEffect(() => {
    const hasFilters = Object.keys(activeFilters).length > 0 || query.trim().length > 0;
    setHasActiveFilters(hasFilters);
  }, [activeFilters, query]);

  const handleSearch = () => {
    onSearch(query, activeFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (filterId: string, value: string | number | boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setQuery('');
    onSearch('', {});
  };

  const clearFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const renderFilterInput = (filter: SearchFilter) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={String(activeFilters[filter.id] || '')}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-100 border border-neutral-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none min-h-[44px]"
          >
            <option value="">{filter.label}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">{filter.label}</label>
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              step={filter.step}
              value={Number(activeFilters[filter.id]) || filter.min}
              onChange={(e) => handleFilterChange(filter.id, parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>{filter.min}</span>
              <span>{Number(activeFilters[filter.id]) || filter.min}</span>
              <span>{filter.max}</span>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">{filter.label}</label>
            <div className="space-y-1">
              {filter.options?.map(option => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer min-h-[44px] px-2 py-1 rounded hover:bg-neutral-800/50">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={activeFilters[filter.id] === option.value}
                    onChange={(e) => {
                      handleFilterChange(filter.id, e.target.checked ? option.value : '');
                    }}
                    className="rounded border-neutral-600 text-amber-500 focus:ring-amber-500/20"
                  />
                  <span className="text-sm text-neutral-200">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">{filter.label}</label>
            <div className="space-y-1">
              {filter.options?.map(option => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer min-h-[44px] px-2 py-1 rounded hover:bg-neutral-800/50">
                  <input
                    type="radio"
                    name={filter.id}
                    value={option.value}
                    checked={activeFilters[filter.id] === option.value}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="border-neutral-600 text-amber-500 focus:ring-amber-500/20"
                  />
                  <span className="text-sm text-neutral-200">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-400" />
        </div>
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none min-h-[48px]"
          aria-label="Search input"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-neutral-700/50"
              aria-label="Clear all filters"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          {showFilters && filters.length > 0 && (
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isFiltersOpen 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50'
              }`}
              aria-label="Toggle filters"
              aria-expanded={isFiltersOpen}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          )}
          <AdvancedButton
            onClick={handleSearch}
            disabled={loading}
            variant="gradient"
            size="sm"
            className="min-h-[44px] min-w-[44px]"
            aria-label="Search"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </AdvancedButton>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {query && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Search: &quot;{query}&quot;
              <button
                onClick={() => setQuery('')}
                className="ml-2 text-amber-300 hover:text-amber-200 min-h-[20px] min-w-[20px] flex items-center justify-center"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {Object.entries(activeFilters).map(([filterId, value]) => {
            const filter = filters.find(f => f.id === filterId);
            if (!filter || !value || (Array.isArray(value) && value.length === 0)) return null;
            
            const displayValue = Array.isArray(value) 
              ? value.join(', ') 
              : filter.options?.find(opt => opt.value === value)?.label || value;
            
            return (
              <span key={filterId} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-neutral-700/50 text-neutral-300 border border-neutral-600">
                {filter.label}: {displayValue}
                <button
                  onClick={() => clearFilter(filterId)}
                  className="ml-2 text-neutral-400 hover:text-neutral-200 min-h-[20px] min-w-[20px] flex items-center justify-center"
                  aria-label={`Clear ${filter.label} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && filters.length > 0 && isFiltersOpen && (
        <GlassCard className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map(filter => (
                <div key={filter.id} className="space-y-2">
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-700">
              <AdvancedButton
                onClick={() => setIsFiltersOpen(false)}
                variant="ghost"
                size="md"
              >
                Close
              </AdvancedButton>
              <AdvancedButton
                onClick={handleSearch}
                variant="gradient"
                size="md"
                disabled={loading}
              >
                Apply Filters
              </AdvancedButton>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default AdvancedSearch;
