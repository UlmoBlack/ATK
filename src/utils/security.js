/**
 * Güvenlik yardımcı fonksiyonları
 * XSS koruması ve input validation
 */

// XSS koruması - HTML karakterlerini escape et
export function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// Input sanitization - sadece alfanumerik ve bazı özel karakterlere izin ver
export function sanitizeInput(input, type = 'username') {
  if (!input) return '';
  
  let pattern;
  switch (type) {
    case 'username':
      // Kullanıcı adı: sadece harf, rakam, alt çizgi, tire, nokta
      pattern = /^[a-zA-Z0-9._-]+$/;
      break;
    case 'email':
      // Email validation
      pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      break;
    case 'password':
      // Şifre için özel karakter kontrolü yapılmaz, sadece uzunluk kontrolü
      return input.trim();
    default:
      pattern = /^[a-zA-Z0-9\s._-]+$/;
  }
  
  const trimmed = input.trim();
  if (type === 'email') {
    return pattern.test(trimmed) ? trimmed : '';
  }
  
  return pattern.test(trimmed) ? trimmed : '';
}

// Kullanıcı adı validation
export function validateUsername(username) {
  if (!username) {
    return { valid: false, message: 'Kullanıcı adı gereklidir' };
  }
  
  if (username.length < 3) {
    return { valid: false, message: 'Kullanıcı adı en az 3 karakter olmalıdır' };
  }
  
  if (username.length > 30) {
    return { valid: false, message: 'Kullanıcı adı çok uzun (maksimum 30 karakter)' };
  }
  
  const sanitized = sanitizeInput(username, 'username');
  if (sanitized !== username) {
    return { valid: false, message: 'Kullanıcı adı sadece harf, rakam, nokta, alt çizgi ve tire içerebilir' };
  }
  
  return { valid: true, message: 'Kullanıcı adı geçerli' };
}

// Şifre validation (basit - backend'de detaylı kontrol yapılır)
export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: 'Şifre gereklidir' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Şifre en az 8 karakter olmalıdır' };
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Şifre çok uzun (maksimum 128 karakter)' };
  }
  
  return { valid: true, message: 'Şifre geçerli' };
}
