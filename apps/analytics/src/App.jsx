import React, { useState, useEffect } from "react";
import "./App.css";
import { analytics, orders, products } from "../../../shared/staticData";

// Simple Chart Components
const LineChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="chart-container">
      <h4 className="chart-title">{title}</h4>
      <div className="line-chart">
        <div className="chart-area">
          {data.map((point, index) => {
            const height = (point.value / maxValue) * 100;
            const left = (index / (data.length - 1)) * 100;
            
            return (
              <div key={index} className="chart-tooltip-wrapper">
                <div
                  className="chart-point"
                  style={{
                    left: `${left}%`,
                    bottom: `${height}%`
                  }}
                >
                  <div className="tooltip">
                    {point.label}: {point.value}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Draw lines between points */}
          <svg className="chart-lines">
            <polyline
              fill="none"
              stroke="var(--tenant-primary, #007bff)"
              strokeWidth="3"
              points={data.map((point, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - (point.value / maxValue) * 100;
                return `${x},${y}`;
              }).join(' ')}
            />
          </svg>
        </div>
        
        <div className="chart-labels">
          {data.map((point, index) => (
            <span key={index} className="chart-label">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="chart-container">
      <h4 className="chart-title">{title}</h4>
      <div className="bar-chart">
        {data.map((bar, index) => (
          <div key={index} className="bar-item">
            <div className="bar-tooltip-wrapper">
              <div
                className="bar"
                style={{
                  height: `${(bar.value / maxValue) * 100}%`,
                  backgroundColor: `hsl(${200 + index * 30}, 70%, 50%)`
                }}
              >
                <div className="bar-tooltip">
                  {bar.label}: {bar.value}
                </div>
              </div>
            </div>
            <span className="bar-label">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="chart-container">
      <h4 className="chart-title">{title}</h4>
      <div className="pie-chart-container">
        <svg className="pie-chart" viewBox="0 0 200 200">
          {data.map((slice, index) => {
            const percentage = (slice.value / total) * 100;
            const angle = (slice.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            currentAngle += angle;
            
            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={`hsl(${index * 60}, 70%, 50%)`}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x={100 + 50 * Math.cos((startAngle + angle/2 - 90) * Math.PI / 180)}
                  y={100 + 50 * Math.sin((startAngle + angle/2 - 90) * Math.PI / 180)}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#fff"
                  fontWeight="bold"
                >
                  {percentage.toFixed(0)}%
                </text>
              </g>
            );
          })}
        </svg>
        
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
              ></div>
              <span>{item.label}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon, color }) => (
  <div className="metric-card" style={{ borderTopColor: color }}>
    <div className="metric-header">
      <span className="metric-icon">{icon}</span>
      <span className="metric-title">{title}</span>
    </div>
    <div className="metric-value">{value}</div>
    {change && (
      <div className={`metric-change ${change > 0 ? 'positive' : 'negative'}`}>
        {change > 0 ? '↗️' : '↘️'} {Math.abs(change)}% from last month
      </div>
    )}
  </div>
);

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Generate analytics data from orders
  const generateAnalyticsData = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.value, 0);
    const averageOrderValue = totalRevenue / orders.length;
    const uniqueCustomers = [...new Set(orders.map(o => o.customer))].length;
    
    // Sales by day (mock data)
    const salesByDay = [
      { label: 'Mon', value: 1200 },
      { label: 'Tue', value: 1800 },
      { label: 'Wed', value: 1600 },
      { label: 'Thu', value: 2200 },
      { label: 'Fri', value: 2800 },
      { label: 'Sat', value: 2400 },
      { label: 'Sun', value: 1900 }
    ];
    
    // Orders by status
    const ordersByStatus = [
      { label: 'Processing', value: orders.filter(o => o.status === 'Processing').length },
      { label: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length },
      { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length }
    ];
    
    // Product categories performance
    const categoryPerformance = products.reduce((acc, product) => {
      const category = product.category;
      const orderCount = orders.filter(o => o.productId === product.id).length;
      
      if (!acc[category]) {
        acc[category] = { label: category, value: 0 };
      }
      acc[category].value += orderCount;
      return acc;
    }, {});
    
    return {
      totalRevenue,
      averageOrderValue,
      uniqueCustomers,
      salesByDay,
      ordersByStatus,
      categoryPerformance: Object.values(categoryPerformance)
    };
  };

  const data = generateAnalyticsData();

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1 className="analytics-title">📊 Analytics Dashboard</h1>
        <p className="analytics-desc">Track performance and gain insights from your data</p>
        
        <div className="analytics-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Revenue"
          value={`₹${data.totalRevenue.toFixed(2)}`}
          change={12.5}
          icon="💰"
          color="#10b981"
        />
        <MetricCard
          title="Total Orders"
          value={orders.length}
          change={8.3}
          icon="📦"
          color="#3b82f6"
        />
        <MetricCard
          title="Active Customers"
          value={data.uniqueCustomers}
          change={15.2}
          icon="👥"
          color="#8b5cf6"
        />
        <MetricCard
          title="Avg Order Value"
          value={`₹${data.averageOrderValue.toFixed(2)}`}
          change={-2.1}
          icon="📈"
          color="#f59e0b"
        />
        <MetricCard
          title="Conversion Rate"
          value="3.2%"
          change={5.7}
          icon="🎯"
          color="#ef4444"
        />
        <MetricCard
          title="Customer LTV"
          value="₹31,500"
          change={9.8}
          icon="⭐"
          color="#06b6d4"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-col-2">
            <LineChart data={data.salesByDay} title="📈 Sales Trend" />
          </div>
          <div className="chart-col-1">
            <PieChart data={data.ordersByStatus} title="🎯 Order Status" />
          </div>
        </div>
        
        <div className="chart-row">
          <div className="chart-col-1">
            <BarChart data={data.categoryPerformance} title="🏷️ Top Categories" />
          </div>
          <div className="chart-col-2">
            <div className="insights-panel">
              <h4>🔍 Key Insights</h4>
              <div className="insights-list">
                {analytics.customerInsights.map((insight, idx) => (
                  <div key={idx} className="insight-item">
                    <span className="insight-icon">💡</span>
                    {insight}
                  </div>
                ))}
                <div className="insight-item">
                  <span className="insight-icon">📊</span>
                  Revenue is trending upward with strong weekend performance
                </div>
                <div className="insight-item">
                  <span className="insight-icon">🎯</span>
                  Most orders are processing efficiently with 85% completion rate
                </div>
                <div className="insight-item">
                  <span className="insight-icon">🚀</span>
                  Customer acquisition cost decreased by 18% this quarter
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="customer-analytics">
        <h3>👥 Customer Analytics</h3>
        <div className="customer-stats">
          <div className="customer-segments">
            <h4>Customer Segments</h4>
            <div className="segment-list">
              <div className="segment-item">
                <span className="segment-name">New Customers</span>
                <span className="segment-value">23%</span>
                <div className="segment-bar">
                  <div className="segment-fill" style={{ width: '23%', backgroundColor: '#10b981' }}></div>
                </div>
              </div>
              <div className="segment-item">
                <span className="segment-name">Returning Customers</span>
                <span className="segment-value">45%</span>
                <div className="segment-bar">
                  <div className="segment-fill" style={{ width: '45%', backgroundColor: '#3b82f6' }}></div>
                </div>
              </div>
              <div className="segment-item">
                <span className="segment-name">VIP Customers</span>
                <span className="segment-value">32%</span>
                <div className="segment-bar">
                  <div className="segment-fill" style={{ width: '32%', backgroundColor: '#8b5cf6' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="top-customers">
            <h4>Top Customers</h4>
            <div className="customer-list">
              {[...new Set(orders.map(o => o.customer))].slice(0, 5).map((customer, idx) => {
                const customerOrders = orders.filter(o => o.customer === customer);
                const totalValue = customerOrders.reduce((sum, o) => sum + o.value, 0);
                
                return (
                  <div key={idx} className="customer-item">
                    <div className="customer-info">
                      <span className="customer-name">{customer}</span>
                      <span className="customer-orders">{customerOrders.length} orders</span>
                    </div>
                    <span className="customer-value">₹{totalValue.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* A/B Testing Results */}
      <div className="ab-testing">
        <h3>🧪 A/B Testing Results</h3>
        <div className="test-results">
          <div className="test-item">
            <div className="test-header">
              <h4>Homepage Banner Test</h4>
              <span className="test-status winner">Winner: Variant B</span>
            </div>
            <div className="test-metrics">
              <div className="variant">
                <span>Variant A</span>
                <span>2.1% CTR</span>
              </div>
              <div className="variant winner">
                <span>Variant B</span>
                <span>3.7% CTR</span>
              </div>
            </div>
          </div>
          
          <div className="test-item">
            <div className="test-header">
              <h4>Checkout Button Color</h4>
              <span className="test-status running">Running</span>
            </div>
            <div className="test-metrics">
              <div className="variant">
                <span>Blue Button</span>
                <span>5.2% Conversion</span>
              </div>
              <div className="variant">
                <span>Green Button</span>
                <span>5.8% Conversion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export as AnalyticsApp to match the shell's import expectation
const AnalyticsApp = AnalyticsDashboard;
export default AnalyticsApp;
