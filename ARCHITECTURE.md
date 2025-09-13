# Technical Architecture Documentation

## 🏗️ System Architecture Overview

This document provides in-depth technical details about the Multi-Tenant E-commerce Platform's architecture, implementation patterns, and design decisions.

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Browser Layer                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                        Shell Application (Port 3050)                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        Application Shell                                │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐     │ │
│  │  │  Tenant Context │  │  Error Boundary │  │  Module Federation  │     │ │
│  │  │   Management    │  │    Component    │  │     Orchestrator    │     │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                          Micro-Frontend Layer                               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│  │   Storefront    │ │     Catalog     │ │     Orders      │ │  Analytics  │ │
│  │  (Port 3001)    │ │  (Port 3002)    │ │  (Port 3003)    │ │(Port 3004)  │ │
│  │                 │ │                 │ │                 │ │             │ │
│  │ • Page Builder  │ │ • Product CRUD  │ │ • Order Kanban  │ │ • Dashboards│ │
│  │ • Templates     │ │ • Variants      │ │ • Status Track  │ │ • Charts    │ │
│  │ • Components    │ │ • Search/Filter │ │ • Drag & Drop   │ │ • Metrics   │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                             Shared Layer                                    │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│  │   Static Data   │ │ Payment Strategy│ │  Common Utils   │ │ Service     │ │
│  │                 │ │                 │ │                 │ │ Worker      │ │
│  │ • Tenants       │ │ • UPI Strategy  │ │ • Event Bus     │ │             │ │
│  │ • Products      │ │ • Card Strategy │ │ • Factories     │ │ • Caching   │ │
│  │ • Orders        │ │ • Wallet        │ │ • Validators    │ │ • Offline   │ │
│  │ • Analytics     │ │   Strategy      │ │                 │ │             │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 Design Principles

### 1. **Micro-Frontend Architecture**
- **Independent Deployment**: Each micro-frontend can be built and deployed separately
- **Technology Agnostic**: Each team can choose their own tech stack (all use React here)
- **Failure Isolation**: If one micro-frontend fails, others continue to work
- **Team Independence**: Each micro-frontend can be developed by different teams

### 2. **Multi-Tenancy**
- **Data Isolation**: Each tenant has separate configurations and data
- **Feature Isolation**: Feature flags control tenant-specific functionality
- **UI Isolation**: Each tenant gets their own branding and theme
- **Performance Isolation**: One tenant's load doesn't affect others


## 🔧 Technical Implementation

### Module Federation Configuration

#### Shell Application (Consumer)
```javascript
// apps/shell/webpack.config.js
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    storefront: 'storefront@http://localhost:3001/remoteEntry.js',
    catalog: 'catalog@http://localhost:3002/remoteEntry.js',
    orders: 'orders@http://localhost:3003/remoteEntry.js',
    analytics: 'analytics@http://localhost:3004/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: false },
    'react-dom': { singleton: true, requiredVersion: false }
  }
})
```

#### Micro-Frontend (Producer)
```javascript
// apps/storefront/webpack.config.js
new ModuleFederationPlugin({
  name: 'storefront',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.jsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: false },
    'react-dom': { singleton: true, requiredVersion: false }
  }
})
```

### Dynamic Remote Loading
```javascript
// loadRemoteComponent.js
function waitForRemote(scope, retries = 20, interval = 250) {
  return new Promise((resolve, reject) => {
    function check() {
      if (window[scope]) {
        resolve(window[scope]);
      } else if (retries > 0) {
        setTimeout(check, interval);
        retries--;
      } else {
        reject(new Error(`Remote ${scope} not found`));
      }
    }
    check();
  });
}

export function loadRemoteComponent(scope, module) {
  return lazy(() =>
    waitForRemote(scope).then(remote => {
      return remote.init(__webpack_share_scopes__.default).then(() =>
        remote.get(module).then(factory => {
          const Module = factory();
          return { default: Module.default || Module };
        })
      );
    })
  );
}
```

## 🎨 Design Patterns Implementation

### 1. Provider Pattern (Tenant Management)
```javascript
// TenantContext.jsx
const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const switchTenant = useCallback((tenantId) => {
    setIsLoading(true);
    const tenant = TENANT_CONFIGS[tenantId];
    if (tenant) {
      setCurrentTenant(tenant);
      // Apply CSS custom properties for theming
      Object.entries(tenant.theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--tenant-${key}`, value);
      });
    }
    setIsLoading(false);
  }, []);

  const updateTenant = useCallback((updatedTenant) => {
    setCurrentTenant(updatedTenant);
    // Apply theme changes immediately
  }, []);

  return (
    <TenantContext.Provider value={{ 
      currentTenant, 
      switchTenant, 
      updateTenant, 
      isLoading 
    }}>
      {children}
    </TenantContext.Provider>
  );
};
```

### 2. Strategy Pattern (Payment Processing)
```javascript
// paymentStrategies.js
export class PaymentContext {
  constructor(strategy) {
    this.setStrategy(strategy);
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  pay(amount) {
    return this.strategy.pay(amount);
  }
}

export class UPIStrategy {
  pay(amount) {
    return `Paid ₹${amount} with UPI.`;
  }
}

export class CreditCardStrategy {
  pay(amount) {
    return `Paid ₹${amount} with Credit Card.`;
  }
}

// Usage
const paymentContext = new PaymentContext(new UPIStrategy());
const result = paymentContext.pay(1000); // "Paid ₹1000 with UPI."
```

### 3. Observer Pattern (Event Bus)
```javascript
// eventBus.js (not currently used but implemented for future real-time features)
const listeners = {};

export function subscribe(event, callback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
  return () => {
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  };
}

export function publish(event, data) {
  if (listeners[event]) {
    listeners[event].forEach(cb => cb(data));
  }
}

// Usage for real-time updates
// subscribe('orderStatusChanged', (orderData) => {
//   // Update UI in real-time
// });
```

### 4. Factory Pattern (Component Generation)
```javascript
// Demonstrated in storefront builder
const componentTemplates = {
  header: { type: 'header', content: 'Welcome to Our Store', style: 'hero' },
  productGrid: { type: 'productGrid', content: 'Featured Products', items: 6 },
  textBlock: { type: 'textBlock', content: 'Add your custom text here...' },
  testimonial: { type: 'testimonial', content: '"Amazing service!"', author: 'Customer' }
};

const createComponent = (type) => {
  const template = componentTemplates[type];
  return { ...template, id: Date.now() };
};
```

## 🚀 Performance Optimizations

### 1. Code Splitting & Lazy Loading
```javascript
// Dynamic imports for micro-frontends
const StorefrontApp = loadRemoteComponent('storefront', './App');
const CatalogApp = loadRemoteComponent('catalog', './App');

// Suspense boundaries for loading states
<Suspense fallback={<LoadingSpinner />}>
  <StorefrontApp />
</Suspense>
```

### 2. React Performance Hooks
```javascript
// Memoization for expensive calculations
const analyticsData = useMemo(() => {
  return generateAnalyticsData(orders, products);
}, [orders, products]);

// Callback memoization to prevent unnecessary re-renders
const handleOrderUpdate = useCallback((orderId, newStatus) => {
  setOrders(prev => prev.map(order => 
    order.id === orderId ? { ...order, status: newStatus } : order
  ));
}, []);
```

### 3. Service Worker Implementation
```javascript
// service-worker.js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('v1').then(cache =>
      cache.match(event.request).then(response =>
        response || fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
      )
    )
  );
});
```

## 🎨 Theming System

### CSS Custom Properties
```css
/* Root CSS variables for tenant theming */
:root {
  --tenant-primary: #2563eb;
  --tenant-secondary: #7c3aed;
  --tenant-accent: #0891b2;
  --tenant-background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --tenant-text: #1e293b;
  --tenant-surface: #ffffff;
}

/* Components use these variables */
.tenant-branded-button {
  background: var(--tenant-primary);
  color: var(--tenant-surface);
  border: 2px solid var(--tenant-accent);
}
```

### Dynamic Theme Application
```javascript
// TenantContext theme switching
const applyTheme = (theme) => {
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--tenant-${key}`, value);
  });
};
```

## 🔒 Error Handling & Resilience

### Error Boundaries
```javascript
// ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Graceful Degradation
```javascript
// Micro-frontend loading with fallback
const renderActiveModule = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {moduleComponent}
      </Suspense>
    </ErrorBoundary>
  );
};
```

## 📊 Data Flow Architecture

### State Management Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  Component      │───▶│  Local State    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Static Data    │◀───│  Shared Context │───▶│  Tenant Config  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Update     │◀───│   Side Effects  │───▶│  Theme Changes  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Inter-Module Communication
```javascript
// Event-based communication between micro-frontends
// (Currently using shared static data, but can be extended)

// Future real-time implementation
const publishOrderUpdate = (orderData) => {
  // Publish to all listening micro-frontends
  window.postMessage({
    type: 'ORDER_UPDATED',
    payload: orderData
  }, '*');
};

// Listen for updates in other micro-frontends
window.addEventListener('message', (event) => {
  if (event.data.type === 'ORDER_UPDATED') {
    // Update local state
  }
});
```

## 🌍 Internationalization (i18n)

### Language Support
```javascript
// TenantContext with language options
const TENANT_CONFIGS = {
  'electronics-hub': {
    settings: {
      language: 'en',
      languageOptions: ['en', 'hi'], // English and Hindi
      currency: 'INR'
    }
  }
};

// Future implementation for translations
const translations = {
  en: {
    'welcome': 'Welcome',
    'products': 'Products',
    'orders': 'Orders'
  },
  hi: {
    'welcome': 'स्वागत है',
    'products': 'उत्पाद',
    'orders': 'आदेश'
  }
};
```

## 🔧 Build & Deployment

### Webpack Configuration Strategy
```javascript
// Base configuration shared across micro-frontends
const baseConfig = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};

// Each micro-frontend extends this base config
module.exports = {
  ...baseConfig,
  plugins: [
    new ModuleFederationPlugin({
      // Micro-frontend specific configuration
    })
  ]
};
```

### Production Deployment Considerations
```javascript
// Production webpack configuration
const productionConfig = {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        // Use production URLs
        storefront: 'storefront@https://storefront.example.com/remoteEntry.js',
        catalog: 'catalog@https://catalog.example.com/remoteEntry.js',
      }
    })
  ]
};
```

## 📈 Monitoring & Analytics

### Performance Monitoring
```javascript
// Performance tracking utility
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  
  // Send to monitoring service
  if (typeof result === 'object' && result.then) {
    return result.then(value => {
      // Track async operations
      return value;
    });
  }
  
  return result;
};

// Usage
const data = measurePerformance('Analytics Calculation', () => {
  return generateAnalyticsData(orders, products);
});
```

### Error Tracking
```javascript
// Global error handler
window.addEventListener('error', (event) => {
  // Send error to monitoring service
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  // Handle unhandled promise rejections
  console.error('Unhandled promise rejection:', event.reason);
});
```

## 🔮 Future Enhancements

### Real-time Features
- WebSocket integration for live updates
- Real-time collaboration in storefront builder
- Live order status notifications
- Chat support integration

### Advanced Analytics
- A/B testing framework
- Machine learning insights
- Predictive analytics
- Customer behavior tracking

### Scalability Improvements
- Database per tenant
- CDN integration
- Auto-scaling infrastructure
- Load balancing strategies

### Security Enhancements
- JWT authentication
- Role-based access control
- API rate limiting
- Data encryption at rest

## 📚 Testing Strategy

### Unit Testing
```javascript
// Example test structure
import { render, screen, fireEvent } from '@testing-library/react';
import { TenantProvider } from './TenantContext';
import App from './App';

describe('Tenant Switching', () => {
  test('should switch tenant and apply theme', () => {
    render(
      <TenantProvider>
        <App />
      </TenantProvider>
    );
    
    const tenantSelect = screen.getByLabelText('Switch Tenant');
    fireEvent.change(tenantSelect, { target: { value: 'fashion-store' } });
    
    expect(screen.getByText('StyleIndia')).toBeInTheDocument();
  });
});
```

### Integration Testing
- Test micro-frontend loading
- Test tenant isolation
- Test error boundary behavior
- Test theme application

### End-to-End Testing
- User journey testing
- Cross-micro-frontend workflows
- Performance testing
- Accessibility testing

## 🎯 Performance Benchmarks

### Target Metrics
- **Initial Load Time**: < 2 seconds
- **Micro-frontend Load**: < 500ms
- **Bundle Size**: < 250KB per micro-frontend
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 3 seconds

### Optimization Techniques
1. **Code Splitting**: Dynamic imports for non-critical features
2. **Tree Shaking**: Remove unused code from bundles
3. **Lazy Loading**: Load micro-frontends on demand
4. **Caching**: Service worker and HTTP caching strategies
5. **Bundle Analysis**: Regular monitoring of bundle sizes

This technical architecture ensures scalability, maintainability, and performance while providing a solid foundation for a multi-tenant e-commerce platform focused on the Indian market.
