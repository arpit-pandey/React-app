import React, { useState } from 'react';
import { tenants } from '../../../shared/staticData';
import './App.css';

const componentTemplates = {
  header: { type: 'header', content: 'Welcome to Our Store', style: 'hero' },
  productGrid: { type: 'productGrid', content: 'Featured Products', items: 6 },
  textBlock: { type: 'textBlock', content: 'Add your custom text here...' },
  testimonial: { type: 'testimonial', content: '"Amazing products and service!"', author: 'Happy Customer' }
};

const ComponentPreview = ({ component, onRemove, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(component.content);

  const handleSave = () => {
    component.content = content;
    setIsEditing(false);
  };

  return (
    <div className="component-preview">
      <div className="component-controls">
        <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
          ✏️ Edit
        </button>
        <button onClick={() => onRemove(index)} className="remove-btn">
          🗑️ Remove
        </button>
      </div>
      
      {isEditing ? (
        <div className="component-editor">
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            className="content-editor"
          />
          <button onClick={handleSave} className="save-btn">Save</button>
        </div>
      ) : (
        <div className={`component-${component.type}`}>
          {component.type === 'header' && (
            <h1 className="preview-header">{component.content}</h1>
          )}
          {component.type === 'productGrid' && (
            <div className="preview-product-grid">
              <h3>{component.content}</h3>
              <div className="grid-preview">
                {Array(component.items).fill(0).map((_, i) => (
                  <div key={i} className="product-card-preview">Product {i + 1}</div>
                ))}
              </div>
            </div>
          )}
          {component.type === 'textBlock' && (
            <p className="preview-text">{component.content}</p>
          )}
          {component.type === 'testimonial' && (
            <blockquote className="preview-testimonial">
              <p>"{component.content}"</p>
              <cite>- {component.author}</cite>
            </blockquote>
          )}
        </div>
      )}
    </div>
  );
};

export default function StorefrontApp() {
  const [pageComponents, setPageComponents] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('basic');

  const addComponent = (type) => {
    const newComponent = { ...componentTemplates[type], id: Date.now() };
    setPageComponents([...pageComponents, newComponent]);
  };

  const removeComponent = (index) => {
    setPageComponents(pageComponents.filter((_, i) => i !== index));
  };

  const loadTemplate = (templateName) => {
    const templates = {
      basic: [
        componentTemplates.header,
        componentTemplates.productGrid,
        componentTemplates.textBlock
      ],
      showcase: [
        componentTemplates.header,
        componentTemplates.testimonial,
        componentTemplates.productGrid,
        componentTemplates.textBlock
      ],
      minimal: [
        componentTemplates.header,
        componentTemplates.textBlock
      ]
    };
    setPageComponents(templates[templateName].map(comp => ({ ...comp, id: Date.now() + Math.random() })));
    setSelectedTemplate(templateName);
  };

  return (
    <div className="storefront-container">
      <div className="storefront-header">
        <h1 className="storefront-title">🎨 Storefront Builder</h1>
        <p className="storefront-desc">Build your perfect storefront with simple drag-and-drop components</p>
      </div>

      <div className="builder-layout">
        {/* Component Palette */}
        <div className="component-palette">
          <h3>📦 Components</h3>
          <div className="palette-grid">
            <button onClick={() => addComponent('header')} className="palette-btn">
              📢 Header
            </button>
            <button onClick={() => addComponent('productGrid')} className="palette-btn">
              🛍️ Product Grid
            </button>
            <button onClick={() => addComponent('textBlock')} className="palette-btn">
              📝 Text Block
            </button>
            <button onClick={() => addComponent('testimonial')} className="palette-btn">
              💬 Testimonial
            </button>
          </div>

          <h3>🎨 Templates</h3>
          <div className="template-grid">
            <button 
              onClick={() => loadTemplate('basic')} 
              className={`template-btn ${selectedTemplate === 'basic' ? 'active' : ''}`}
            >
              Basic Store
            </button>
            <button 
              onClick={() => loadTemplate('showcase')} 
              className={`template-btn ${selectedTemplate === 'showcase' ? 'active' : ''}`}
            >
              Showcase
            </button>
            <button 
              onClick={() => loadTemplate('minimal')} 
              className={`template-btn ${selectedTemplate === 'minimal' ? 'active' : ''}`}
            >
              Minimal
            </button>
          </div>
        </div>

        {/* Page Builder */}
        <div className="page-builder">
          <div className="builder-header">
            <h3>🖼️ Page Preview</h3>
            <div className="builder-actions">
              <button onClick={() => setPageComponents([])} className="clear-btn">
                🗑️ Clear All
              </button>
              <button className="preview-btn">👁️ Preview</button>
            </div>
          </div>

          <div className="page-canvas">
            {pageComponents.length === 0 ? (
              <div className="empty-canvas">
                <div className="empty-state">
                  <h4>🎯 Start Building</h4>
                  <p>Add components from the palette or choose a template to get started</p>
                </div>
              </div>
            ) : (
              pageComponents.map((component, index) => (
                <ComponentPreview
                  key={component.id}
                  component={component}
                  onRemove={removeComponent}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
