import React, { createContext, useContext, useEffect, useState } from 'react';

const TenantContext = createContext();

// Static tenant configurations
const TENANT_CONFIGS = {
  'electronics-hub': {
    id: 'electronics-hub',
    name: 'Electronics Hub',
    domain: 'electronics-hub.com',
    theme: {
      primary: '#6366f1', // indigo
      secondary: '#8b5cf6', // violet
      accent: '#06b6d4', // cyan
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#1f2937'
    },
    features: {
      inventory: true,
      analytics: true,
      advancedCatalog: true,
      multiCurrency: false
    },
    layout: {
      header: 'modern',
      sidebar: true,
      footer: 'minimal'
    },
    branding: {
      logo: '� TechBazar',
      tagline: 'India ki Digital Duniya',
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6'
    },
    settings: {
      currency: 'INR',
      language: 'en',
      languageOptions: ['en', 'hi'],
      itemsPerPage: 20
    }
  },
  'fashion-store': {
    id: 'fashion-store',
    name: 'Fashion Store',
    domain: 'fashion-store.com',
    theme: {
      primary: '#ec4899', // pink
      secondary: '#f59e0b', // amber
      accent: '#10b981', // emerald
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      text: '#374151'
    },
    features: {
      inventory: true,
      analytics: true,
      advancedCatalog: true,
      multiCurrency: true
    },
    layout: {
      header: 'elegant',
      sidebar: false,
      footer: 'detailed'
    },
    branding: {
      logo: '👗 StyleIndia',
      tagline: 'Apna Style, Apni Pasand',
      primaryColor: '#ec4899',
      secondaryColor: '#f59e0b'
    },
    settings: {
      currency: 'INR',
      language: 'en',
      languageOptions: ['en', 'hi'],
      itemsPerPage: 15
    }
  },
  'book-corner': {
    id: 'book-corner',
    name: 'Book Corner',
    domain: 'book-corner.com',
    theme: {
      primary: '#059669', // emerald
      secondary: '#dc2626', // red
      accent: '#7c3aed', // violet
      background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)',
      text: '#1f2937'
    },
    features: {
      inventory: false,
      analytics: true,
      advancedCatalog: false,
      multiCurrency: false
    },
    layout: {
      header: 'classic',
      sidebar: true,
      footer: 'minimal'
    },
    branding: {
      logo: '📚 GyaanKosh',
      tagline: 'Gyan Se Bhara Sansar',
      primaryColor: '#059669',
      secondaryColor: '#dc2626'
    },
    settings: {
      currency: 'INR',
      language: 'en',
      languageOptions: ['en', 'hi'],
      itemsPerPage: 25
    }
  },
  'demo-shop': {
    id: 'demo-shop',
    name: 'Universal Shop',
    domain: 'demo-shop.com',
    theme: {
      primary: '#3b82f6', // blue
      secondary: '#6b7280', // gray
      accent: '#f59e0b', // amber
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#1f2937'
    },
    features: {
      inventory: true,
      analytics: true,
      advancedCatalog: true,
      multiCurrency: true
    },
    layout: {
      header: 'modern',
      sidebar: true,
      footer: 'detailed'
    },
    branding: {
      logo: '🛍️ DesiMart',
      tagline: 'Sab Kuch Ek Jagah',
      primaryColor: '#3b82f6',
      secondaryColor: '#6b7280'
    },
    settings: {
      currency: 'INR',
      language: 'en',
      languageOptions: ['en', 'hi'],
      itemsPerPage: 20
    }
  }
};

export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load default tenant on mount
    loadTenant('electronics-hub');
  }, []);

  const loadTenant = (tenantId) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const tenant = TENANT_CONFIGS[tenantId] || TENANT_CONFIGS['demo-shop'];
      setCurrentTenant(tenant);
      
      // Apply theme to document root
      applyTheme(tenant.theme);
      
      setIsLoading(false);
    }, 500);
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.style.setProperty('--tenant-primary', theme.primary);
    root.style.setProperty('--tenant-secondary', theme.secondary);
    root.style.setProperty('--tenant-accent', theme.accent);
    root.style.setProperty('--tenant-background', theme.background);
    root.style.setProperty('--tenant-text', theme.text);
  };

  const updateTenant = (updatedTenant) => {
    // Update the in-memory config (in a real app, this would update the backend)
    TENANT_CONFIGS[updatedTenant.id] = updatedTenant;
    setCurrentTenant(updatedTenant);
    applyTheme(updatedTenant.theme);
  };

  const switchTenant = (tenantId) => {
    if (tenantId !== currentTenant?.id) {
      loadTenant(tenantId);
    }
  };

  const value = {
    currentTenant,
    isLoading,
    switchTenant,
    loadTenant,
    updateTenant,
    availableTenants: Object.values(TENANT_CONFIGS)
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export default TenantContext;
