/**
 * API konfigürasyonu ve güvenli API çağrıları
 * Backend: Spring Boot (http://localhost:3000/api)
 * Token'lar HttpOnly cookie'lerde saklanır
 */

// API base URL - environment variable'dan alınmalı
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Güvenli API çağrısı
export async function secureApiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // ÇOK ÖNEMLİ: HttpOnly cookie'ler için zorunlu!
  };
  
  try {
    const response = await fetch(url, config);
    
    // Rate limiting kontrolü
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new Error(`Çok fazla istek. Lütfen ${retryAfter || 'bir süre'} sonra tekrar deneyin.`);
    }
    
    // Unauthorized - token geçersiz
    if (response.status === 401) {
      const { clearAuthData } = await import('../utils/auth');
      clearAuthData();
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    
    // Diğer hatalar
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Network hatası
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
    }
    throw error;
  }
}

// Login API çağrısı
export async function loginAPI(username, password) {
  return secureApiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: username.trim(),
      password: password,
    }),
  });
}

// Logout API çağrısı
export async function logoutAPI() {
  return secureApiCall('/auth/logout', {
    method: 'POST',
  });
}

// Kullanıcı bilgilerini al
export async function getUserInfoAPI() {
  return secureApiCall('/auth/me', {
    method: 'GET',
  });
}

// Token yenileme
export async function refreshTokenAPI() {
  // Refresh token cookie'de olduğu için body göndermeye gerek yok
  return secureApiCall('/auth/refresh', {
    method: 'POST',
  });
}
