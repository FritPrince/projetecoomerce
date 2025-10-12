import React, { useState, useEffect, useRef } from 'react';
import { Categorie } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
// import { Button } from '@/components/ui/button'; // Removed as filters apply immediately

interface FilterSidebarProps {
    categories: Categorie[];
    onFilterChange: (filters: { categoryIds: number[]; minPrice: number; maxPrice: number }) => void;
}

export default function FilterSidebar({ categories, onFilterChange }: FilterSidebarProps) {
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // Default price range

    // Debounce mechanism for applying filters
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            onFilterChange({
                categoryIds: selectedCategoryIds,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
            });
        }, 300); // Debounce for 300ms

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [selectedCategoryIds, priceRange, onFilterChange]);

    const handleCategoryChange = (categoryId: number, checked: boolean) => {
        setSelectedCategoryIds(prev => 
            checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
        );
    };

    // No need for applyFilters button anymore
    // const applyFilters = () => {
    //     onFilterChange({
    //         categoryIds: selectedCategoryIds,
    //         minPrice: priceRange[0],
    //         maxPrice: priceRange[1],
    //     });
    // };

    return (
        <div className="w-full space-y-6 p-4 lg:p-0">
            <h3 className="text-xl font-bold">Filtres</h3>

            {/* Catégories */}
            <Accordion type="multiple" className="w-full">
                <AccordionItem value="categories">
                    <AccordionTrigger className="text-base font-semibold">Catégories</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {categories.map(categorie => (
                                <div key={categorie.id} className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`cat-${categorie.id}`}
                                            checked={selectedCategoryIds.includes(categorie.id)}
                                            onCheckedChange={(checked: boolean) => handleCategoryChange(categorie.id, checked)}
                                        />
                                        <Label htmlFor={`cat-${categorie.id}`}>{categorie.nom}</Label>
                                    </div>
                                    {categorie.sous_categories && categorie.sous_categories.length > 0 && (
                                        <div className="ml-4 space-y-1">
                                            {categorie.sous_categories.map(sousCat => (
                                                <div key={sousCat.id} className="flex items-center space-x-2">
                                                    <Checkbox 
                                                        id={`sous-cat-${sousCat.id}`}
                                                        checked={selectedCategoryIds.includes(sousCat.id)}
                                                        onCheckedChange={(checked: boolean) => handleCategoryChange(sousCat.id, checked)}
                                                    />
                                                    <Label htmlFor={`sous-cat-${sousCat.id}`} className="text-sm text-muted-foreground">{sousCat.nom}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Prix */}
            <div className="space-y-4">
                <h4 className="text-base font-semibold">Prix</h4>
                <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={(value: [number, number]) => setPriceRange(value)}
                    className="w-[90%]"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0]} €</span>
                    <span>{priceRange[1]} €</span>
                </div>
            </div>

            {/* <Button onClick={applyFilters} className="w-full">Appliquer les filtres</Button> */}
        </div>
    );
}