import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';

interface WishlistButtonProps {
    produitId: number;
    isFavori?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outline' | 'ghost';
    showText?: boolean;
    className?: string;
}

export default function WishlistButton({
    produitId,
    isFavori: initialIsFavori = false,
    size = 'md',
    variant = 'ghost',
    showText = false,
    className = ''
}: WishlistButtonProps) {
    const [isFavori, setIsFavori] = useState(initialIsFavori);
    const [loading, setLoading] = useState(false);

    const checkFavoriStatus = async () => {
        try {
            const response = await fetch(`/api/favoris/check?produit_id=${produitId}`);
            if (response.ok) {
                const data = await response.json();
                setIsFavori(data.is_favori);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du statut favori:', error);
        }
    };

    useEffect(() => {
        checkFavoriStatus();
    }, [produitId]);

    const toggleFavori = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch('/api/favoris/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ produit_id: produitId }),
            });

            if (response.ok) {
                const data = await response.json();
                setIsFavori(data.is_favori);
                toast.success(data.message);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Erreur lors du toggle favori:', error);
            toast.error('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-8 w-8';
            case 'lg':
                return 'h-12 w-12';
            default:
                return 'h-10 w-10';
        }
    };

    const getButtonSize = () => {
        switch (size) {
            case 'sm':
                return 'sm' as const;
            case 'lg':
                return 'lg' as const;
            default:
                return 'default' as const;
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'sm':
                return 'h-4 w-4';
            case 'lg':
                return 'h-6 w-6';
            default:
                return 'h-5 w-5';
        }
    };

    return (
        <Button
            variant={variant}
            size={getButtonSize()}
            onClick={toggleFavori}
            disabled={loading}
            className={`${getSizeClasses()} ${className} ${
                isFavori ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
            } transition-colors`}
        >
            <Heart 
                className={`${getIconSize()} ${isFavori ? 'fill-current' : ''}`} 
            />
            {showText && (
                <span className="ml-2">
                    {isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </span>
            )}
        </Button>
    );
}
