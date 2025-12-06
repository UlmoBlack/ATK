import { useState } from 'react';
import { sanitizeInput, validateUsername, validatePassword, escapeHtml } from '../utils/security';
import '../styles.css';

export default function LoginCard({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    const sanitized = sanitizeInput(value, 'username');
    setUsername(sanitized);
    
    if (value) {
      const validation = validateUsername(sanitized);
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, username: validation.message }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.username;
          return newErrors;
        });
      }
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.username;
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value && value.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Şifre en az 8 karakter olmalıdır' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setErrors(prev => ({ ...prev, username: usernameValidation.message }));
      return;
    }
    
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Şifre gereklidir' }));
      return;
    }
    
    if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Şifre en az 8 karakter olmalıdır' }));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const safeUsername = escapeHtml(username.trim());
      await onLogin(safeUsername, password);
    } catch (error) {
      setErrors({ general: error.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="luxury-login-box">
        <div className="luxury-header">
          <div className="brand-logo">
            <span className="brand-name">AtkFuture</span>
          </div>
          <p className="brand-tagline">Future Control Interface</p>
        </div>
        
        <form className="luxury-form" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="luxury-error">
              <span>{errors.general}</span>
            </div>
          )}
          
          <div className="luxury-input-group">
            <label className="luxury-label">Username / Email</label>
            <input 
              type="text" 
              placeholder="Enter credentials" 
              required
              value={username}
              onChange={handleUsernameChange}
              maxLength={30}
              autoComplete="username"
              disabled={isLoading}
              className="luxury-input"
            />
            {errors.username && (
              <span className="luxury-error-text">
                {errors.username}
              </span>
            )}
          </div>
          
          <div className="luxury-input-group">
            <label className="luxury-label">Access Code</label>
            <input 
              type="password" 
              placeholder="••••••••••" 
              required
              value={password}
              onChange={handlePasswordChange}
              maxLength={128}
              autoComplete="current-password"
              disabled={isLoading}
              className="luxury-input"
            />
            {errors.password && (
              <span className="luxury-error-text">
                {errors.password}
              </span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="luxury-btn" 
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            <span className="btn-content">
              {isLoading ? 'Authenticating' : 'Access System'}
            </span>
          </button>
        </form>
        
        <div className="luxury-footer">
          <div className="status-line">
            <span className="status-dot"></span>
            <span className="status-text">Secure Connection Established</span>
          </div>
        </div>
      </div>
    </div>
  );
}
