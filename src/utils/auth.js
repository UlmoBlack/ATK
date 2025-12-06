/**
 * Authentication yardımcı fonksiyonları
 * Token'lar HttpOnly cookie'lerde backend tarafından yönetiliyor
 */

// Kullanıcı bilgilerini sakla
export function setUserData(userData) {
  try {
    // Hassas bilgileri saklamayın (şifre, token vb.)
    const safeData = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    };
    localStorage.setItem('user_data', JSON.stringify(safeData));
  } catch (error) {
    console.error('Kullanıcı verisi kaydedilemedi:', error);
  }
}

// Kullanıcı bilgilerini al
export function getUserData() {
  try {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Kullanıcı verisi alınamadı:', error);
    return null;
  }
}

// Tüm auth verilerini temizle (logout)
export function clearAuthData() {
  try {
    localStorage.removeItem('user_data');
    sessionStorage.clear();
  } catch (error) {
    console.error('Auth verileri temizlenemedi:', error);
  }
}

// Rol kontrolü
export function hasRole(userRole, requiredRole) {
  if (!userRole) return false;
  
  // Rol hiyerarşisi
  const roleHierarchy = {
    'ADMIN': 3,
    'MODERATOR': 2,
    'USER': 1,
    'GUEST': 0
  };
  
  const userLevel = roleHierarchy[userRole.toUpperCase()] || 0;
  const requiredLevel = roleHierarchy[requiredRole.toUpperCase()] || 0;
  
  return userLevel >= requiredLevel;
}

// Birden fazla rol kontrolü
export function hasAnyRole(userRole, requiredRoles) {
  if (!userRole || !Array.isArray(requiredRoles)) return false;
  return requiredRoles.some(role => hasRole(userRole, role));
}
