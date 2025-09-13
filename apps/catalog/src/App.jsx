import React, { useState } from 'react';
import { products as initialProducts } from '../../../shared/staticData';
import './App.css';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    category: product?.category || 'electronics',
    variants: product?.variants?.join(', ') || '',
    description: product?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: product?.id || Date.now(),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      variants: formData.variants.split(',').map(v => v.trim()).filter(v => v),
      description: formData.description
    };
    onSave(newProduct);
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form">
        <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
            </select>
          </div>
          <div className="form-group">
            <label>Variants (comma-separated)</label>
            <input
              type="text"
              value={formData.variants}
              onChange={(e) => setFormData({...formData, variants: e.target.value})}
              placeholder="Red, Blue, Large, Small"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter products based on search and category
  React.useEffect(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      setProducts([...products, productData]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      setSelectedProducts(new Set());
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts.size > 0 && window.confirm(`Delete ${selectedProducts.size} selected products?`)) {
      setProducts(products.filter(p => !selectedProducts.has(p.id)));
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1 className="catalog-title">📦 Product Catalog</h1>
        <p className="catalog-desc">Manage your product inventory with ease</p>
      </div>

      {/* Controls */}
      <div className="catalog-controls">
        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="action-buttons">
          {selectedProducts.size > 0 && (
            <button onClick={handleBulkDelete} className="btn-danger">
              🗑️ Delete Selected ({selectedProducts.size})
            </button>
          )}
          <button 
            onClick={() => setShowForm(true)} 
            className="btn-primary"
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      {/* Product Stats */}
      <div className="product-stats">
        <div className="stat-card">
          <h3>{products.length}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>{categories.length}</h3>
          <p>Categories</p>
        </div>
        <div className="stat-card">
          <h3>₹{products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</h3>
          <p>Total Value</p>
        </div>
        <div className="stat-card">
          <h3>{filteredProducts.length}</h3>
          <p>Showing</p>
        </div>
      </div>

      {/* Product Table */}
      <div className="table-container">
        <table className="catalog-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Variants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className={selectedProducts.has(product.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td>
                  <div className="product-info">
                    <strong>{product.name}</strong>
                    {product.description && (
                      <small>{product.description}</small>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`category-badge category-${product.category}`}>
                    {product.category}
                  </span>
                </td>
                <td className="price">₹{product.price.toFixed(2)}</td>
                <td>
                  <div className="variants">
                    {product.variants.slice(0, 2).map(variant => (
                      <span key={variant} className="variant-tag">{variant}</span>
                    ))}
                    {product.variants.length > 2 && (
                      <span className="variant-more">+{product.variants.length - 2}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="btn-edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
