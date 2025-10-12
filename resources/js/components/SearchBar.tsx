import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface SearchBarProps {
    className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Suggestions prédéfinies
    const predefinedSuggestions = [
        'iPhone', 'Samsung', 'MacBook', 'AirPods', 'Apple Watch',
        'Ordinateur', 'Téléphone', 'Casque', 'Montre', 'Tablette',
        'Électronique', 'Accessoires', 'Informatique', 'Mobile'
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (searchQuery: string = query) => {
        if (searchQuery.trim()) {
            router.get('/search', { q: searchQuery.trim() }, {
                preserveState: false,
            });
            setShowSuggestions(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            // Filtrer les suggestions basées sur la saisie
            const filteredSuggestions = predefinedSuggestions
                .filter(suggestion => 
                    suggestion.toLowerCase().includes(value.toLowerCase())
                )
                .slice(0, 5);
            
            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    };

    const clearSearch = () => {
        setQuery('');
        setShowSuggestions(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    placeholder="Rechercher un produit..."
                    className="pl-10 pr-10"
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => query.length > 0 && setShowSuggestions(true)}
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={clearSearch}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <div className="flex items-center">
                                <Search className="h-4 w-4 text-gray-400 mr-2" />
                                {suggestion}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Message si aucune suggestion */}
            {showSuggestions && suggestions.length === 0 && query.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4"
                >
                    <div className="text-sm text-gray-500 text-center">
                        Aucune suggestion trouvée pour "{query}"
                    </div>
                </div>
            )}
        </div>
    );
}

