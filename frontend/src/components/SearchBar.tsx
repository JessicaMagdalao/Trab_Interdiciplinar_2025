import React, { useState, useCallback, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (term: string) => void;
  placeholder?: string;
  loading?: boolean;
  debounceMs?: number;
  showClearButton?: boolean;
  autoSearch?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Pesquisar animes...',
  loading = false,
  debounceMs = 500,
  showClearButton = true,
  autoSearch = true,
  className = ''
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (!autoSearch) return;
    const timer = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
        if (internalValue.trim()) {
          onSearch(internalValue.trim());
        }
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internalValue, value, onChange, onSearch, debounceMs, autoSearch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      if (!autoSearch) onChange(newValue);
    },
    [onChange, autoSearch]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = internalValue.trim();
      if (trimmed) {
        onChange(trimmed);
        onSearch(trimmed);
      }
    },
    [internalValue, onChange, onSearch]
  );

  const handleClear = useCallback(() => {
    setInternalValue('');
    onChange('');
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') handleClear();
    },
    [handleClear]
  );

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400"
          aria-hidden="true"
        />
        <Input
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-20 bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
          disabled={loading}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Carregando" />}
          {showClearButton && internalValue && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={handleClear}
              aria-label="Limpar pesquisa"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {!autoSearch && (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              disabled={loading || !internalValue.trim()}
              aria-label="Pesquisar"
            >
              <Search className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      {internalValue.length > 0 && (
        <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground dark:text-gray-400">
          {internalValue.length} caracteres
        </div>
      )}
    </form>
  );
}
