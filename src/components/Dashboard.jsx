import { useState } from 'react';
import { escapeHtml } from '../utils/security';
import '../styles.css';

export default function Dashboard({ username, userRole, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const safeUsername = escapeHtml(username || 'User');
  const safeRole = escapeHtml(userRole || 'operator');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '◆' },
    { id: 'systems', label: 'Systems', icon: '◈' },
    { id: 'analytics', label: 'Analytics', icon: '◇' },
    { id: 'settings', label: 'Settings', icon: '◎' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h1>System Overview</h1>
              <p className="dashboard-subtitle">Spacecraft Control Center</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">◆</div>
                <div className="stat-info">
                  <span className="stat-label">Power Status</span>
                  <span className="stat-value">98.7%</span>
                </div>
                <div className="stat-indicator active"></div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">◈</div>
                <div className="stat-info">
                  <span className="stat-label">Life Support</span>
                  <span className="stat-value">Optimal</span>
                </div>
                <div className="stat-indicator active"></div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">◇</div>
                <div className="stat-info">
                  <span className="stat-label">Hull Integrity</span>
                  <span className="stat-value">100%</span>
                </div>
                <div className="stat-indicator active"></div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">◎</div>
                <div className="stat-info">
                  <span className="stat-label">Navigation</span>
                  <span className="stat-value">Online</span>
                </div>
                <div className="stat-indicator active"></div>
              </div>
            </div>

            <div className="info-panels">
              <div className="info-panel">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-time">14:23</span>
                    <span className="activity-text">System diagnostic completed</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">13:45</span>
                    <span className="activity-text">Power levels optimized</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">12:18</span>
                    <span className="activity-text">Navigation update received</span>
                  </div>
                </div>
              </div>

              <div className="info-panel">
                <h3>System Status</h3>
                <div className="status-list">
                  <div className="status-item">
                    <span className="status-label">Primary Systems</span>
                    <span className="status-badge operational">Operational</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Backup Systems</span>
                    <span className="status-badge standby">Standby</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Communications</span>
                    <span className="status-badge operational">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'systems':
        return (
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h1>System Management</h1>
              <p className="dashboard-subtitle">Control & Monitoring</p>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">◈</div>
              <p>System controls and monitoring tools</p>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h1>Analytics Dashboard</h1>
              <p className="dashboard-subtitle">Performance Metrics</p>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">◇</div>
              <p>Data analytics and performance reports</p>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h1>System Settings</h1>
              <p className="dashboard-subtitle">Configuration & Preferences</p>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">◎</div>
              <p>System configuration and user preferences</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="nav-logo">AtkFuture</span>
        </div>

        <div className="nav-tabs">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-tab-icon">{item.icon}</span>
              <span className="nav-tab-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-profile">
          <button 
            className="profile-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              {safeUsername.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <span className="profile-name">{safeUsername}</span>
              <span className="profile-role">{safeRole}</span>
            </div>
            <span className="profile-arrow">▾</span>
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-header">
                <div className="profile-menu-avatar">
                  {safeUsername.charAt(0).toUpperCase()}
                </div>
                <div className="profile-menu-info">
                  <span className="profile-menu-name">{safeUsername}</span>
                  <span className="profile-menu-role">{safeRole}</span>
                </div>
              </div>
              <div className="profile-menu-divider"></div>
              <button className="profile-menu-item">
                <span className="profile-menu-icon">◇</span>
                Profile Settings
              </button>
              <button className="profile-menu-item">
                <span className="profile-menu-icon">◈</span>
                Preferences
              </button>
              <div className="profile-menu-divider"></div>
              <button className="profile-menu-item logout" onClick={onLogout}>
                <span className="profile-menu-icon">◆</span>
                Disconnect
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
}

