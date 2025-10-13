import React from 'react';
import { motion } from 'framer-motion';
import { Produit } from '@/types';
import './ProductCard.scss';

interface ProductCardProps {
  produit: Produit;
  onAddToCart: (produitId: number) => void;
  onAddToFavorites: (produitId: number) => void;
  onViewDetails?: (produit: Produit) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  produit,
  onAddToCart,
  onAddToFavorites,
  onViewDetails
}) => {
  // Animation variants
  const cardVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: { duration: 0.3 }
    }
  };



  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const badgeVariants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  console.log(produit);

  // Ensure prix is a number before calling toFixed
  const formattedPrix = typeof produit.prix === 'number' ? produit.prix.toFixed(2) : parseFloat(produit.prix).toFixed(2);

  return (
    <motion.div 
      className="product-card"
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
    >
      {/* Badge pour stock faible ou catégorie */}
      {produit.quantite_stock < 5 && (
        <motion.span 
          className="product-badge stock-low"
          variants={badgeVariants}
          initial="initial"
          animate="animate"
        >
          Stock limité
        </motion.span>
      )}
      
      <motion.span 
        className="product-badge category"
        variants={badgeVariants}
        initial="initial"
        animate="animate"
      >
        {produit.sous_categorie?.nom || 'Catégorie'}
      </motion.span>

      {/* Image du produit */}
      <div className="product-image-container">
        <motion.img 
          src={produit.image_url || 'https://placehold.co/600x400?text=produit'} 
          alt={produit.nom}
          variants={imageVariants}
          className="product-image"
        />
        <motion.button
          className="favorite-button"
          onClick={() => onAddToFavorites(produit.id)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </motion.button>
        {onViewDetails && (
          <motion.button
            className="view-details-button"
            onClick={() => onViewDetails(produit)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Voir détails
          </motion.button>
        )}
      </div>

      {/* Informations du produit */}
      <div className="product-info">
        <h3 className="product-title">{produit.nom}</h3>
        <p className="product-description">{produit.description}</p>
        <div className="product-price-container">
          <span className="product-price">{formattedPrix} €</span>
          <motion.button
            className="add-to-cart-button"
            onClick={() => onAddToCart(produit.id)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Ajouter
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;