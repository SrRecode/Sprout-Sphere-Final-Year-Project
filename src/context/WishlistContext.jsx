import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (plant) => {
    if (!plant || !plant._id) {
      toast.error('Invalid plant data');
      return;
    }

    setWishlist(prevWishlist => {
      if (prevWishlist.some(item => item._id === plant._id)) {
        toast.info(`${plant.name} is already in your wishlist`);
        return prevWishlist;
      }
      toast.success(`Added ${plant.name} to wishlist`);
      return [...prevWishlist, plant];
    });
  };

  const removeFromWishlist = (plantId) => {
    setWishlist(prevWishlist => {
      const plant = prevWishlist.find(item => item._id === plantId);
      if (plant) {
        toast.info(`Removed ${plant.name} from wishlist`);
      }
      return prevWishlist.filter(item => item._id !== plantId);
    });
  };

  const isInWishlist = (plantId) => {
    return wishlist.some(item => item._id === plantId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast.info('Wishlist cleared');
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext; 