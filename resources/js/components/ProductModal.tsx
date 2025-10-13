import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart } from 'lucide-react';
import { Produit } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductModalProps {
    produit: Produit | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (produitId: number) => void;
    onAddToFavorites: (produitId: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
    produit, 
    isOpen, 
    onClose,
    onAddToCart,
    onAddToFavorites
}) => {
    if (!produit) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div 
                        className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image du produit */}
                        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
                            <motion.img 
                                src={produit.image_url || 'https://via.placeholder.com/400x500?text=Produit'}
                                alt={produit.nom}
                                className="max-h-[400px] object-contain"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            />
                        </div>

                        {/* Détails du produit */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <motion.h2 
                                    className="text-2xl font-bold"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {produit.nom}
                                </motion.h2>
                                <button 
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <motion.div 
                                className="text-2xl font-bold text-primary mb-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {formatPrice(produit.prix)}
                            </motion.div>

                            <motion.div 
                                className="mb-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-gray-600">{produit.description}</p>
                            </motion.div>

                            <motion.div 
                                className="mb-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="font-semibold mb-2">Disponibilité</h3>
                                <p className={`${produit.quantite_stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {produit.quantite_stock > 0 
                                        ? `En stock (${produit.quantite_stock} disponibles)` 
                                        : 'Rupture de stock'}
                                </p>
                            </motion.div>

                            <div className="mt-auto space-y-3">
                                <motion.button
                                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={() => onAddToCart(produit.id)}
                                    disabled={produit.quantite_stock <= 0}
                                >
                                    <ShoppingCart size={18} />
                                    Ajouter au panier
                                </motion.button>

                                <motion.button
                                    className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    onClick={() => onAddToFavorites(produit.id)}
                                >
                                    <Heart size={18} />
                                    Ajouter aux favoris
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;