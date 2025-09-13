import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { TenantProvider, useTenant } from './contexts/TenantContext';
import { loadRemoteComponent } from './loadRemoteComponent';
import './App.css';

// Remote Components
const StorefrontApp = loadRemoteComponent('storefront', './App');
const CatalogApp = loadRemoteComponent('catalog', './App');
const OrdersApp = loadRemoteComponent('orders', './App');
const AnalyticsApp = loadRemoteComponent('analytics', './App');

// Local Configuration Component
const ConfigurationApp = () => {
  const { currentTenant, updateTenant } = useTenant();
  const [config, setConfig] = useState({
    branding: { ...currentTenant.branding },
    features: { ...currentTenant.features },
    settings: { ...currentTenant.settings }
  });
  const [previewMode, setPreviewMode] = useState(false);

  const handleBrandingChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      branding: { ...prev.branding, [field]: value }
    }));
  };

  const handleFeatureToggle = (feature) => {
    setConfig(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: !prev.features[feature] }
    }));
  };

  const handleSettingChange = (setting, value) => {
    setConfig(prev => ({
      ...prev,
      settings: { ...prev.settings, [setting]: value }
    }));
  };

  const applyChanges = () => {
    updateTenant({
      ...currentTenant,
      ...config
    });
    alert('Configuration updated successfully!');
  };

  const resetChanges = () => {
    setConfig({
      branding: { ...currentTenant.branding },
      features: { ...currentTenant.features },
      settings: { ...currentTenant.settings }
    });
  };

  return (
    <div className="config-container">
      <div className="config-header">
        <h1>⚙️ Tenant Configuration</h1>
        <p>Customize your tenant's appearance and features</p>
        
        <div className="config-actions">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className={`btn-toggle ${previewMode ? 'active' : ''}`}
          >
            {previewMode ? '👁️ Exit Preview' : '👁️ Preview Changes'}
          </button>
          <button onClick={resetChanges} className="btn-secondary">
            🔄 Reset
          </button>
          <button onClick={applyChanges} className="btn-primary">
            💾 Save Changes
          </button>
        </div>
      </div>

      <div className="config-grid">
        {/* Branding Section */}
        <div className="config-section">
          <h3>🎨 Branding</h3>
          
          <div className="form-group">
            <label>Logo/Store Name</label>
            <input
              type="text"
              value={config.branding.logo}
              onChange={(e) => handleBrandingChange('logo', e.target.value)}
              placeholder="Enter store name or logo text"
            />
          </div>
          
          <div className="form-group">
            <label>Tagline</label>
            <input
              type="text"
              value={config.branding.tagline}
              onChange={(e) => handleBrandingChange('tagline', e.target.value)}
              placeholder="Enter store tagline"
            />
          </div>
          
          <div className="form-group">
            <label>Primary Color</label>
            <div className="color-input-group">
              <input
                type="color"
                value={config.branding.primaryColor}
                onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
              />
              <input
                type="text"
                value={config.branding.primaryColor}
                onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                placeholder="#007bff"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Secondary Color</label>
            <div className="color-input-group">
              <input
                type="color"
                value={config.branding.secondaryColor}
                onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
              />
              <input
                type="text"
                value={config.branding.secondaryColor}
                onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                placeholder="#6c757d"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="config-section">
          <h3>🔧 Features</h3>
          
          {Object.entries(config.features).map(([feature, enabled]) => (
            <div key={feature} className="feature-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleFeatureToggle(feature)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">
                  {feature.charAt(0).toUpperCase() + feature.slice(1)}
                </span>
              </label>
              <small className="feature-desc">
                {feature === 'analytics' && 'Enable detailed analytics and reporting'}
                {feature === 'advancedCatalog' && 'Advanced product management features'}
                {feature === 'multiCurrency' && 'Support for multiple currencies'}
                {feature === 'inventory' && 'Inventory tracking and management'}
              </small>
            </div>
          ))}
        </div>

        {/* Settings Section */}
        <div className="config-section">
          <h3>📋 Settings</h3>
          
          <div className="form-group">
            <label>Currency</label>
            <select
              value={config.settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
            >
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Language</label>
            <select
              value={config.settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Items per Page</label>
            <input
              type="number"
              min="5"
              max="100"
              value={config.settings.itemsPerPage}
              onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="config-section preview-section">
          <h3>👁️ Live Preview</h3>
          
          <div 
            className="preview-container"
            style={{
              '--preview-primary': config.branding.primaryColor,
              '--preview-secondary': config.branding.secondaryColor
            }}
          >
            <div className="preview-header">
              <h4 style={{ color: 'var(--preview-primary)' }}>
                {config.branding.logo}
              </h4>
              <p>{config.branding.tagline}</p>
            </div>
            
            <div className="preview-content">
              <div className="preview-card">
                <h5>Sample Product</h5>
                <p>This is how your products will look</p>
                <button 
                  className="preview-btn"
                  style={{ backgroundColor: 'var(--preview-primary)' }}
                >
                  Add to Cart
                </button>
              </div>
              
              <div className="preview-features">
                <h5>Enabled Features:</h5>
                <ul>
                  {Object.entries(config.features)
                    .filter(([, enabled]) => enabled)
                    .map(([feature]) => (
                      <li key={feature}>
                        ✅ {feature.charAt(0).toUpperCase() + feature.slice(1)}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Loading Component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Micro-frontend error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>⚠️ Module Loading Error</h3>
          <p>Failed to load micro-frontend: {this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Tenant Route Component
const TenantRoute = () => {
  const { tenantId } = useParams();
  const { currentTenant, isLoading, loadTenant } = useTenant();

  useEffect(() => {
    if (tenantId) {
      loadTenant(tenantId);
    }
  }, [tenantId, loadTenant]);

  if (isLoading) {
    return <LoadingSpinner message={`Loading ${tenantId}...`} />;
  }

  if (!currentTenant) {
    return (
      <div className="tenant-not-found">
        <h2>Tenant Not Found</h2>
        <p>The tenant "{tenantId}" could not be found.</p>
        <Navigate to="/tenant/electronics-hub" replace />
      </div>
    );
  }

  return <ShellApp />;
};

// Main Shell Application
const ShellApp = () => {
  const { currentTenant } = useTenant();
  const [activeModule, setActiveModule] = useState('storefront');
  const navigate = useNavigate();

  if (!currentTenant) return null;

  const renderActiveModule = () => {
    const modules = {
      storefront: { component: <StorefrontApp />, name: 'Storefront Builder' },
      catalog: { component: <CatalogApp />, name: 'Product Catalog' },
      orders: { component: <OrdersApp />, name: 'Order Management' },
      analytics: { component: <AnalyticsApp />, name: 'Analytics Hub' },
      settings: { component: <ConfigurationApp />, name: 'Configuration' }
    };

    const module = modules[activeModule];
    
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner message={`Loading ${module.name}...`} />}>
          <div className="module-header">
            <h2>{module.name}</h2>
            <div className="module-breadcrumb">
              <span>{currentTenant.branding.logo}</span>
              <span>→</span>
              <span>{module.name}</span>
            </div>
          </div>
          <div className="module-content">
            {module.component}
          </div>
        </Suspense>
      </ErrorBoundary>
    );
  };

  const handleTenantSwitch = (newTenantId) => {
    navigate(`/tenant/${newTenantId}`);
  };

  return (
    <div className="shell-container">
      {/* Header */}
      <header className="shell-header">
        <div className="header-content">
          <div className="tenant-info">
            <h1>{currentTenant.branding.logo}</h1>
            <p className="tenant-tagline">{currentTenant.branding.tagline}</p>
          </div>
          
          <div className="tenant-switcher">
            <label>
              <span>Switch Tenant:</span>
              <select 
                value={currentTenant.id} 
                onChange={(e) => handleTenantSwitch(e.target.value)}
              >
                <option value="electronics-hub">� TechBazar</option>
                <option value="fashion-store">👗 StyleIndia</option>
                <option value="book-corner">📚 GyaanKosh</option>
                <option value="demo-shop">🛍️ DesiMart</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="shell-nav">
        <button 
          className={`shell-nav-btn ${activeModule === 'storefront' ? 'active' : ''}`}
          onClick={() => setActiveModule('storefront')}
        >
          🏪 Storefront Builder
        </button>
        <button 
          className={`shell-nav-btn ${activeModule === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveModule('catalog')}
        >
          📦 Product Catalog
        </button>
        <button 
          className={`shell-nav-btn ${activeModule === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveModule('orders')}
        >
          📋 Order Management
        </button>
        {currentTenant.features.analytics && (
          <button 
            className={`shell-nav-btn ${activeModule === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveModule('analytics')}
          >
            📊 Analytics Hub
          </button>
        )}
        <button 
          className={`shell-nav-btn ${activeModule === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveModule('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-content">
        {renderActiveModule()}
      </main>

      {/* Footer */}
      <footer className="shell-footer">
        <div className="footer-content">
          <p>© 2025 {currentTenant.name} - Multi-Tenant E-commerce Platform</p>
          <div className="tenant-features">
            {Object.entries(currentTenant.features)
              .filter(([, enabled]) => enabled)
              .map(([feature]) => (
                <span key={feature} className="feature-badge">{feature}</span>
              ))
            }
          </div>
        </div>
      </footer>
    </div>
  );
};

// Home Route - Redirect to default tenant
const HomeRoute = () => {
  return <Navigate to="/tenant/electronics-hub" replace />;
};

// Main App with Router
const App = () => {
  return (
    <TenantProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/tenant/:tenantId" element={<TenantRoute />} />
          <Route path="*" element={<Navigate to="/tenant/electronics-hub" replace />} />
        </Routes>
      </Router>
    </TenantProvider>
  );
};

export default App;
