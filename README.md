# Multi-Tenant E-commerce Platform Builder

A comprehensive micro-frontend e-commerce platform built with React 18+ and Module Federation, designed for the Indian market with full localization support.

## � **Deploy & Run on GitHub**

### **Option 1: GitHub Codespaces (Instant Setup)**
1. Go to: `https://github.com/arpit-pandey/React-app`
2. Click **Code** → **Codespaces** → **Create codespace on master**
3. Wait for environment setup (2-3 minutes)
4. Run: `npm run start:all`
5. Open ports 3050, 3001, 3002, 3003, 3004 when prompted
6. Access shell at the provided Codespace URL

### **Option 2: Gitpod (One-Click Setup)**
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/arpit-pandey/React-app)

### **Option 3: GitHub Pages (Auto-Deploy)**
- GitHub Actions workflow included (`.github/workflows/deploy.yml`)
- Automatically deploys on push to master
- Enable GitHub Pages in repository settings
- Site will be available at: `https://arpit-pandey.github.io/React-app`

### **Option 4: Netlify (Drag & Drop)**
1. Build locally: `npm run build:all`
2. Drag `deploy` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Or connect GitHub repo for auto-deploy

### **Option 5: Vercel (One-Click)**
1. Import project from GitHub at [vercel.com](https://vercel.com)
2. Auto-detects configuration from `vercel.json`
3. Deploys all micro-frontends automatically

## �🎯 Project Overview

This project is a **multi-tenant e-commerce platform** that allows multiple businesses to create and customize their own storefronts while sharing core functionality. Each tenant gets their own branded experience with configurable features, themes, and business logic.

### 🌟 Key Features

- **🏢 Multi-Tenant Architecture**: Complete isolation between tenants
- **🔧 Micro-Frontend Design**: Independent deployment and scaling
- **🇮🇳 Indian Market Focused**: INR currency, Hindi/English support, UPI payments
- **🎨 Dynamic Theming**: Per-tenant branding and customization
- **📊 Real-time Analytics**: Comprehensive business insights
- **📦 Module Federation**: Webpack 5 micro-frontend orchestration
- **⚡ Performance Optimized**: Lazy loading, code splitting, service workers

## 📋 Project Requirements (User Stories)

### Epic 1: Platform Administration ✅
- **Story 1.1**: Create tenant accounts with unique subdomains and feature toggles
- **Story 1.2**: Manage feature flags per tenant (analytics, inventory, payments)
- **Story 1.3**: Monitor platform performance across all tenants

### Epic 2: Tenant Management & Configuration ✅
- **Story 2.1**: Switch between multiple storefronts seamlessly
- **Story 2.2**: Customize storefront themes and branding
- **Story 2.3**: Configure payment methods (UPI, Credit Card, Digital Wallet)

### Epic 3: Storefront Builder ✅
- **Story 3.1**: Drag-and-drop component builder for custom pages
- **Story 3.2**: Save and reuse page templates
- **Story 3.3**: Real-time preview and editing capabilities

### Epic 4: Product Catalog Management ✅
- **Story 4.1**: Product management with form validation
- **Story 4.2**: Product variants (size, color) with pricing
- **Story 4.3**: Inventory tracking and management
- **Story 4.4**: Search and filter functionality

### Epic 5: Order Management ✅
- **Story 5.1**: Bulk order processing and status management
- **Story 5.2**: Kanban-style order pipeline (Processing → Shipped → Delivered)
- **Story 5.3**: Order fulfillment tracking with drag-and-drop
- **Story 5.4**: Real-time order status updates

### Epic 6: Analytics & Reporting ✅
- **Story 6.1**: Sales performance metrics (revenue, AOV, customer insights)
- **Story 6.2**: Customer behavior analytics and segmentation
- **Story 6.3**: Real-time dashboard with customizable widgets

### Epic 7: System Performance & Reliability ✅
- **Story 7.1**: Sub-2 second load times with lazy loading
- **Story 7.2**: Offline capabilities with service workers
- **Story 7.3**: Error boundaries with graceful fallback UI

## 🏗️ Architecture Overview

### Micro-Frontend Structure
```
┌─────────────────────────────────────────────────────────────┐
│                        Shell App (Port 3050)                │
│                    ┌─────────────────────┐                  │
│                    │   Tenant Context    │                  │
│                    │   Theme Management  │                  │
│                    │   Error Boundaries  │                  │
│                    └─────────────────────┘                  │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │ Storefront  │   Catalog   │   Orders    │  Analytics  │  │
│  │(Port 3001) │(Port 3002) │(Port 3003) │(Port 3004) │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technical Stack

#### Core Technologies
- **React 18.2+**: Latest React with Concurrent Features
- **Webpack 5**: Module Federation for micro-frontends
- **JavaScript (ES6+)**: Modern JavaScript features
- **CSS3**: Custom properties for theming
- **Module Federation**: Independent micro-frontend loading

#### Development Tools
- **Babel**: Modern JavaScript transpilation
- **npm workspaces**: Monorepo management
- **Service Workers**: Offline functionality
- **Error Boundaries**: Robust error handling

#### Architecture Patterns
- **Provider Pattern**: Tenant context management
- **Factory Pattern**: Component generation
- **Observer Pattern**: Real-time updates (event bus)
- **Strategy Pattern**: Payment processing
- **Module Federation**: Micro-frontend orchestration

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 16+ required
- **npm**: Version 8+ required
- **Git**: For cloning the repository

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd "New folder/React app"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start All Applications**
   ```bash
   npm run start:all
   ```

   This command will start:
   - **Storefront** micro-frontend on `http://localhost:3001`
   - **Catalog** micro-frontend on `http://localhost:3002` 
   - **Orders** micro-frontend on `http://localhost:3003`
   - **Analytics** micro-frontend on `http://localhost:3004`
   - **Shell** application on `http://localhost:3050`

4. **Access the Application**
   - Open your browser to `http://localhost:3050`
   - The shell will automatically load all micro-frontends
   - Switch between tenants using the dropdown in the header

### Alternative: Start Individual Applications

```bash
# Start individual micro-frontends
npm run start:storefront  # Port 3001
npm run start:catalog     # Port 3002  
npm run start:orders      # Port 3003
npm run start:analytics   # Port 3004
npm run start:shell       # Port 3050 (after remotes are ready)
```

## 📁 Project Structure

```
React app/
├── apps/                          # Micro-frontend applications
│   ├── shell/                     # Main orchestrator application
│   │   ├── src/
│   │   │   ├── contexts/
│   │   │   │   └── TenantContext.jsx    # Tenant management
│   │   │   ├── App.jsx                  # Shell app main component
│   │   │   ├── ErrorBoundary.jsx        # Error handling
│   │   │   ├── loadRemoteComponent.js   # Module Federation utility
│   │   │   └── App.css                  # Shell-specific styles
│   │   ├── public/
│   │   │   ├── index.html               # Shell HTML template
│   │   │   └── service-worker.js        # Offline functionality
│   │   ├── webpack.config.js            # Module Federation config
│   │   └── package.json
│   ├── storefront/                # Storefront builder micro-frontend
│   │   ├── src/
│   │   │   ├── App.jsx                  # Drag-and-drop page builder
│   │   │   ├── App.css                  # Storefront styles
│   │   │   └── index.jsx                # Entry point
│   │   ├── webpack.config.js            # Exposes ./App
│   │   └── package.json
│   ├── catalog/                   # Product catalog micro-frontend
│   │   ├── src/
│   │   │   ├── App.jsx                  # Product management
│   │   │   ├── App.css                  # Catalog styles  
│   │   │   └── index.jsx                # Entry point
│   │   ├── webpack.config.js            # Exposes ./App
│   │   └── package.json
│   ├── orders/                    # Order management micro-frontend
│   │   ├── src/
│   │   │   ├── App.jsx                  # Kanban order pipeline
│   │   │   ├── App.css                  # Orders styles
│   │   │   └── index.jsx                # Entry point
│   │   ├── webpack.config.js            # Exposes ./App
│   │   └── package.json
│   └── analytics/                 # Analytics dashboard micro-frontend
│       ├── src/
│       │   ├── App.jsx                  # Charts and metrics
│       │   ├── App.css                  # Analytics styles
│       │   └── index.jsx                # Entry point
│       ├── webpack.config.js            # Exposes ./App
│       └── package.json
├── shared/                        # Shared utilities and data
│   ├── staticData.js                    # Mock data for all apps
│   └── paymentStrategies.js             # Payment Strategy Pattern
├── package.json                   # Root package.json with workspaces
├── package-lock.json             # Dependency lock file
└── README.md                     # This documentation
```

## 🎨 Features Implementation

### 1. Multi-Tenant System
**Location**: `apps/shell/src/contexts/TenantContext.jsx`

```javascript
// Tenant configuration with Indian context
const TENANT_CONFIGS = {
  'electronics-hub': {
    branding: {
      logo: '📱 TechBazar',
      tagline: 'India ki Digital Duniya'
    },
    settings: {
      currency: 'INR',
      language: 'en',
      languageOptions: ['en', 'hi']
    }
  }
  // ... more tenants
};
```

**Features**:
- Dynamic theme switching
- Per-tenant feature flags
- Indian market localization (INR, Hindi support)
- Isolated tenant configurations

### 2. Storefront Builder
**Location**: `apps/storefront/src/App.jsx`

**Features**:
- Component-based page builder
- Template system (basic, showcase, minimal)
- Real-time preview
- Drag-and-drop functionality (simulated)

**Components Available**:
- Header sections
- Product grids
- Text blocks
- Testimonials

### 3. Product Catalog Management
**Location**: `apps/catalog/src/App.jsx`

**Features**:
- Product CRUD operations
- Variant management (size, color)
- Category filtering
- Search functionality
- Pricing in INR

### 4. Order Management System
**Location**: `apps/orders/src/App.jsx`

**Features**:
- Kanban-style order pipeline
- Drag-and-drop status updates
- Order processing workflow
- Customer tracking
- Status: Processing → Shipped → Delivered

### 5. Analytics Dashboard
**Location**: `apps/analytics/src/App.jsx`

**Features**:
- Sales performance metrics
- Customer behavior analytics
- Interactive charts (Line, Bar, Pie)
- Customer segmentation
- Key performance indicators
- Revenue tracking in INR

### 6. Payment System
**Location**: `shared/paymentStrategies.js`

**Indian Payment Methods**:
- UPI (most popular in India)
- Credit Cards
- Digital Wallets

```javascript
// Strategy Pattern implementation
export class UPIStrategy {
  pay(amount) {
    return `Paid ₹${amount} with UPI.`;
  }
}
```

## 🔧 Technical Implementation Details

### Module Federation Setup

Each micro-frontend exposes its main component:

```javascript
// webpack.config.js (example)
new ModuleFederationPlugin({
  name: 'storefront',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.jsx',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
})
```

The shell app consumes these remotes:

```javascript
// Shell webpack.config.js
remotes: {
  storefront: 'storefront@http://localhost:3001/remoteEntry.js',
  catalog: 'catalog@http://localhost:3002/remoteEntry.js',
  // ... other remotes
}
```

### Dynamic Component Loading

```javascript
// loadRemoteComponent.js
export function loadRemoteComponent(scope, module) {
  return lazy(() =>
    waitForRemote(scope).then(remote => {
      return remote.get(module).then(factory => {
        const Module = factory();
        return { default: Module.default || Module };
      });
    })
  );
}
```

### Error Boundaries

```javascript
// ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

### State Management

**Tenant Context Pattern**:
```javascript
// TenantContext.jsx
export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null);
  // Tenant switching logic
  return (
    <TenantContext.Provider value={{ currentTenant, switchTenant }}>
      {children}
    </TenantContext.Provider>
  );
};
```

## 📚 Learning Path & Required Knowledge

### For Beginners

#### 1. JavaScript Fundamentals
- **ES6+ Features**: Arrow functions, destructuring, modules
- **Promises & Async/Await**: For handling asynchronous operations
- **Array Methods**: map, filter, reduce for data manipulation

#### 2. React Fundamentals
- **Components**: Functional components and JSX
- **Hooks**: useState, useEffect, useContext, useMemo, useCallback
- **Props & State**: Component communication and state management
- **Event Handling**: User interactions and form handling

#### 3. CSS & Styling
- **CSS3**: Flexbox, Grid, Custom Properties (CSS Variables)
- **Responsive Design**: Media queries and mobile-first approach
- **Component-based CSS**: Scoped styles and CSS modules

### For Intermediate Developers

#### 4. Advanced React Patterns
- **Context API**: Global state management
- **Higher-Order Components (HOCs)**: Component composition
- **Render Props**: Flexible component APIs
- **Custom Hooks**: Reusable stateful logic

#### 5. Modern JavaScript Build Tools
- **Webpack**: Module bundling and configuration
- **Babel**: JavaScript transpilation
- **npm/yarn**: Package management and scripts

#### 6. React Ecosystem
- **React Router**: Client-side routing
- **Error Boundaries**: Error handling in React
- **Performance Optimization**: Memoization, lazy loading

### For Advanced Developers

#### 7. Micro-Frontend Architecture
- **Module Federation**: Webpack 5 micro-frontend orchestration
- **Independent Deployment**: Separate build and deploy cycles
- **Shared Dependencies**: Optimizing bundle sizes
- **Cross-Application Communication**: Event systems and state sharing

#### 8. Design Patterns
- **Provider Pattern**: Context-based state management
- **Factory Pattern**: Dynamic component creation
- **Observer Pattern**: Event-driven architecture
- **Strategy Pattern**: Pluggable algorithms (payment methods)

#### 9. Performance & Optimization
- **Code Splitting**: Dynamic imports and lazy loading
- **Bundle Analysis**: Webpack bundle analyzer
- **Service Workers**: Offline functionality and caching
- **Memory Management**: Preventing memory leaks

#### 10. Enterprise Patterns
- **Multi-Tenancy**: Isolated tenant configurations
- **Feature Flags**: Conditional feature activation
- **Error Monitoring**: Centralized error tracking
- **Scalability**: Horizontal scaling strategies

## 🎯 Key Concepts Demonstrated

### 1. **Module Federation** (Webpack 5)
- Independent micro-frontend deployment
- Runtime composition of applications
- Shared dependency optimization

### 2. **Multi-Tenant Architecture**
- Tenant isolation and configuration
- Dynamic theming per tenant
- Feature flag management

### 3. **Indian Market Localization**
- INR currency throughout
- Hindi/English language support
- UPI payment integration
- Indian customer names and context

### 4. **Performance Optimization**
- Lazy loading of micro-frontends
- Code splitting and dynamic imports
- Service worker for offline functionality
- Memoization and optimization hooks

### 5. **Design Patterns Implementation**
- Strategy Pattern for payments
- Provider Pattern for tenant context
- Factory Pattern for component creation
- Observer Pattern for real-time updates

## 🚀 Deployment & Production Considerations

### Build for Production
```bash
# Build all applications
npm run build --workspaces

# Each app creates a dist/ folder with production bundles
```

### Environment Configuration
- Configure production URLs for Module Federation remotes
- Set up environment variables for API endpoints
- Configure service worker caching strategies

### Scaling Considerations
- Each micro-frontend can be deployed independently
- CDN deployment for static assets
- Load balancing for high availability
- Database per tenant for true multi-tenancy

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes** and test thoroughly
4. **Commit with conventional commits**: `feat: add new payment method`
5. **Push to your branch**: `git push origin feature/new-feature`
6. **Create a Pull Request**

### Development Guidelines
- Follow the existing code structure
- Add tests for new features
- Update documentation as needed
- Ensure all micro-frontends work independently

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Additional Resources

- [Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [React 18 Documentation](https://react.dev/)
- [Multi-Tenant Architecture Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/multitenancy)
- [Micro-Frontend Architecture](https://micro-frontends.org/)

---

**Built with ❤️ for the Indian e-commerce market**
