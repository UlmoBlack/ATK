import { escapeHtml } from '../utils/security';
import '../styles.css';

export default function WelcomeCard({ username, userRole, onLogout }) {
  // XSS koruması - username'i escape et
  const safeUsername = escapeHtml(username || 'Kullanıcı');
  const safeRole = escapeHtml(userRole || 'user');
  
  return (
    <div className="main-content">
      <div className="luxury-welcome-box">
        <div className="luxury-welcome-header">
          <div className="welcome-status">
            <div className="pulse-ring"></div>
            <div className="welcome-icon">✓</div>
          </div>
          <h1>Welcome Aboard</h1>
          <p className="welcome-subtitle">Access Authorized</p>
        </div>
        
        <div className="luxury-welcome-content">
          <div className="profile-card">
            <div className="profile-row">
              <span className="profile-label">Operator</span>
              <span className="profile-value">{safeUsername}</span>
            </div>
            {userRole && (
              <div className="profile-row">
                <span className="profile-label">Authorization</span>
                <span className="profile-value level">{safeRole.toUpperCase()}</span>
              </div>
            )}
            <div className="profile-row">
              <span className="profile-label">System Status</span>
              <span className="profile-value active">OPERATIONAL</span>
            </div>
          </div>
          
          <button className="luxury-btn disconnect" onClick={onLogout}>
            <span className="btn-content">Disconnect Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}

