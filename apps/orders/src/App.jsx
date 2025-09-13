import React, { useState } from 'react';
import { orders as initialOrders, products } from '../../../shared/staticData';
import './App.css';

const statusColumns = [
  { 
    key: 'Processing', 
    label: 'Processing', 
    color: '#ffd43b',
    icon: '⚙️',
    description: 'Orders being prepared'
  },
  { 
    key: 'Shipped', 
    label: 'Shipped', 
    color: '#339af0',
    icon: '🚚',
    description: 'Orders in transit'
  },
  { 
    key: 'Delivered', 
    label: 'Delivered', 
    color: '#51cf66',
    icon: '✅',
    description: 'Completed orders'
  },
];

function getProductName(productId) {
  const product = products.find(p => p.id === productId);
  return product ? product.name : 'Unknown Product';
}

const OrderCard = ({ order, onDrop, onEdit }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', order.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUrgencyColor = (days) => {
    if (days > 7) return '#e3f2fd';
    if (days > 3) return '#fff3e0';
    return '#ffebee';
  };

  const daysSinceOrder = Math.floor((Date.now() - new Date(order.date)) / (1000 * 60 * 60 * 24));

  return (
    <div
      className={`order-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ background: getUrgencyColor(daysSinceOrder) }}
    >
      <div className="order-header">
        <span className="order-id">#{order.id.replace('order-', '')}</span>
        <button className="edit-btn" onClick={() => onEdit(order)}>✏️</button>
      </div>
      
      <div className="order-content">
        <div className="order-product">
          <strong>{getProductName(order.productId)}</strong>
        </div>
        
        <div className="order-customer">
          👤 {order.customer}
        </div>
        
        <div className="order-details">
          <span className="order-value">💰 ₹{order.value.toFixed(2)}</span>
          <span className="order-date">📅 {formatDate(order.date)}</span>
        </div>
        
        {daysSinceOrder <= 1 && (
          <div className="order-badge new">New</div>
        )}
        
        {daysSinceOrder > 7 && (
          <div className="order-badge urgent">Urgent</div>
        )}
      </div>
    </div>
  );
};

const OrderForm = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: order?.customer || '',
    productId: order?.productId || products[0]?.id || '',
    value: order?.value || '',
    status: order?.status || 'Processing',
    date: order?.date || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      id: order?.id || `order-${Date.now()}`,
      customer: formData.customer,
      productId: formData.productId,
      value: parseFloat(formData.value),
      status: formData.status,
      date: formData.date
    };
    onSave(newOrder);
  };

  return (
    <div className="order-form-overlay">
      <div className="order-form">
        <h3>{order ? 'Edit Order' : 'Add New Order'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Product</label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({...formData, productId: e.target.value})}
              required
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Order Value (₹)</label>
            <input
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              {statusColumns.map(col => (
                <option key={col.key} value={col.key}>{col.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Order Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">
              {order ? 'Update' : 'Add'} Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function OrdersApp() {
  const [orders, setOrders] = useState(initialOrders);
  const [draggedOver, setDraggedOver] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain');
    
    setOrders(orders.map(order =>
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    setDraggedOver(null);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDraggedOver(status);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleSaveOrder = (orderData) => {
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? orderData : o));
    } else {
      setOrders([...orders, orderData]);
    }
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProductName(order.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm)
  );

  const getColumnStats = (status) => {
    const columnOrders = filteredOrders.filter(o => o.status === status);
    return {
      count: columnOrders.length,
      value: columnOrders.reduce((sum, o) => sum + o.value, 0)
    };
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">📋 Order Management</h1>
        <p className="orders-desc">Drag orders between columns to update their status</p>
      </div>

      <div className="orders-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search orders, customers, or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="action-section">
          <button 
            onClick={() => setShowForm(true)} 
            className="btn-primary"
          >
            ➕ Add Order
          </button>
        </div>
      </div>

      <div className="orders-stats">
        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>₹{orders.reduce((sum, o) => sum + o.value, 0).toFixed(2)}</h3>
          <p>Total Value</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.status === 'Processing').length}</h3>
          <p>Processing</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.status === 'Delivered').length}</h3>
          <p>Delivered</p>
        </div>
      </div>

      <div className="orders-kanban">
        {statusColumns.map(column => {
          const stats = getColumnStats(column.key);
          const columnOrders = filteredOrders.filter(o => o.status === column.key);
          
          return (
            <div 
              className={`orders-column ${draggedOver === column.key ? 'drag-over' : ''}`}
              key={column.key}
              onDrop={(e) => handleDrop(e, column.key)}
              onDragOver={(e) => handleDragOver(e, column.key)}
              onDragLeave={handleDragLeave}
            >
              <div 
                className="orders-column-header"
                style={{ borderTopColor: column.color }}
              >
                <div className="column-title">
                  <span className="column-icon">{column.icon}</span>
                  <span className="column-name">{column.label}</span>
                </div>
                <div className="column-stats">
                  <span className="column-count">{stats.count}</span>
                  <span className="column-value">₹{stats.value.toFixed(2)}</span>
                </div>
                <p className="column-desc">{column.description}</p>
              </div>
              
              <div className="orders-column-content">
                {columnOrders.map(order => (
                  <div key={order.id} className="order-wrapper">
                    <OrderCard 
                      order={order} 
                      onEdit={handleEditOrder}
                    />
                    <button 
                      className="delete-order-btn"
                      onClick={() => handleDeleteOrder(order.id)}
                      title="Delete order"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                
                {columnOrders.length === 0 && (
                  <div className="empty-column">
                    <p>No orders in {column.label.toLowerCase()}</p>
                    <small>Drag orders here to update status</small>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <OrderForm
          order={editingOrder}
          onSave={handleSaveOrder}
          onCancel={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
        />
      )}
    </div>
  );
}
