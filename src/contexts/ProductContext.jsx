import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../utils/api';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFiltersState] = useState({
    category: '',
    priceRange: [0, 1000],
    sortBy: 'name',
    search: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        category: filters.category || undefined,
        search: filters.search || undefined,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: filters.sortBy,
      };

      const response = await apiService.getProducts(params);
      setProducts(response.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await apiService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const setFilters = (newFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const getProduct = async (id) => {
    try {
      return await apiService.getProduct(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const addProduct = async (productData) => {
    try {
      const newProduct = await apiService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await apiService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      filteredProducts: products, // Since filtering is now done on backend
      categories,
      filters,
      loading,
      setFilters,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      fetchProducts,
    }}>
      {children}
    </ProductContext.Provider>
  );
};