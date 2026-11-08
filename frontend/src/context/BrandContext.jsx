import React, { createContext, useContext, useState, useEffect } from 'react';
import { brandAPI } from '../services/api';

const BrandContext = createContext(null);

export const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await brandAPI.getAll();
      if (res.data?.success && res.data.data.length > 0) {
        setBrands(res.data.data);
        if (!selectedBrand) {
          setSelectedBrand(res.data.data[0]);
        } else {
          const updated = res.data.data.find((b) => b._id === selectedBrand._id);
          if (updated) setSelectedBrand(updated);
        }
      }
    } catch (err) {
      console.warn('Error fetching brands:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <BrandContext.Provider
      value={{
        brands,
        selectedBrand,
        setSelectedBrand,
        fetchBrands,
        loading,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
