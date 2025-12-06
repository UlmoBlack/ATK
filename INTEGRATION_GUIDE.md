# Frontend-Backend Entegrasyon Rehberi

Bu rehber, React frontend'inizi Spring Boot backend'e nasıl bağlayacağınızı adım adım açıklar.

## 🚀 Hızlı Başlangıç

### 1. Backend'i Başlatın

```bash
cd backend
mvn spring-boot:run
```

Backend şu adreste çalışacak: `http://localhost:3000/api`

### 2. Frontend'i Başlatın

```bash
cd .. # Proje root'una dön
npm run dev
```

Frontend şu adreste çalışacak: `http://localhost:5173`

## ⚙️ Frontend Konfigürasyonu

### 1. Environment Variables

`.env` dosyası oluşturun (proje root'unda):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. API Config Güncellemesi

`src/config/api.js` dosyanızı güncelleyin:

```javascript
// API base URL
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
    credentials: 'include', // ÇOK ÖNEMLİ: Cookie'ler için zorunlu!
  };
  
  try {
    const response = await fetch(url, config);
    
    // 401 Unauthorized - token geçersiz
    if (response.status === 401) {
      const { clearAuthData } = await import('../utils/auth');
      clearAuthData();
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Login API çağrısı
export async function loginAPI(username, password) {
  return secureApiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
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
  return secureApiCall('/auth/refresh', {
    method: 'POST',
  });
}
```

### 3. Auth Hook Güncellemesi

`src/hooks/useAuth.js` dosyanızı güncelleyin:

```javascript
import { useState, useEffect, useCallback } from 'react';
import { loginAPI, logoutAPI, getUserInfoAPI, refreshTokenAPI } from '../config/api';
import { 
  setUserData,
  getUserData,
  clearAuthData
} from '../utils/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Token kontrolü ve kullanıcı bilgilerini yükle
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Cookie'den token'ı kontrol et (backend otomatik kontrol eder)
        const userData = await getUserInfoAPI();
        setUser(userData);
        setIsAuthenticated(true);
        setUserData(userData);
      } catch (error) {
        // Token geçersiz veya yok
        clearAuthData();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login fonksiyonu
  const login = useCallback(async (username, password) => {
    try {
      setIsLoading(true);
      const response = await loginAPI(username, password);
      
      // Token'lar cookie'de, sadece user bilgisi dönüyor
      setUserData(response.user);
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.' 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout fonksiyonu
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logoutAPI();
      
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout hatası:', error);
      // Hata olsa bile local temizlik yap
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
```

### 4. Auth Utils Güncellemesi

`src/utils/auth.js` dosyasını basitleştirin (token'lar artık cookie'de):

```javascript
// Kullanıcı bilgilerini sakla
export function setUserData(userData) {
  try {
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
```

## 🔑 Test Kullanıcıları

Backend otomatik olarak şu kullanıcıları oluşturur:

### Admin Kullanıcı
```
Username: admin
Password: Admin123!
Role: ADMIN
```

### Normal Kullanıcı
```
Username: testuser
Password: Test123!
Role: USER
```

## 🧪 Test Senaryoları

### 1. Login Testi

```javascript
// LoginCard.jsx içinde
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    await onLogin('admin', 'Admin123!');
    // Başarılı - cookie'ler otomatik set edildi
  } catch (error) {
    console.error('Login hatası:', error);
  }
};
```

### 2. Kullanıcı Bilgilerini Alma

```javascript
// useAuth hook otomatik kontrol eder
const { user, isAuthenticated } = useAuth();

if (isAuthenticated) {
  console.log('Kullanıcı:', user.username);
  console.log('Rol:', user.role);
}
```

### 3. Logout Testi

```javascript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // Cookie'ler temizlendi, state güncellendi
};
```

## 🐛 Yaygın Sorunlar ve Çözümleri

### 1. CORS Hatası

**Hata**: `Access to fetch at 'http://localhost:3000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Çözüm**: Backend `application.yml` dosyasında CORS ayarlarını kontrol edin:

```yaml
cors:
  allowed-origins: http://localhost:5173,http://localhost:3000
  allow-credentials: true
```

### 2. Cookie Gönderilmiyor

**Hata**: Cookie'ler backend'e gönderilmiyor

**Çözüm**: 
- Tüm fetch çağrılarında `credentials: 'include'` olmalı
- CORS'ta `allow-credentials: true` olmalı
- Cookie domain ayarları kontrol edin

### 3. 401 Unauthorized

**Hata**: `/auth/me` endpoint'i 401 dönüyor

**Çözüm**:
- Cookie'nin expire olmadığını kontrol edin
- Token süresi dolmuşsa refresh endpoint'ini kullanın
- Browser DevTools > Application > Cookies'den cookie'yi kontrol edin

### 4. Token Yenileme

Access token 15 dakika sonra expire olur. Otomatik yenileme için:

```javascript
// api.js içinde 401 handling
if (response.status === 401) {
  try {
    // Refresh token'ı kullan
    await refreshTokenAPI();
    // İsteği tekrar dene
    return secureApiCall(endpoint, options);
  } catch (refreshError) {
    // Refresh de başarısız, logout
    clearAuthData();
    window.location.href = '/';
  }
}
```

## 📋 Production Checklist

### Backend

- [ ] JWT secret'ı environment variable olarak ayarla
- [ ] PostgreSQL'e geç (H2 yerine)
- [ ] HTTPS aktif et
- [ ] `jwt.cookie.secure: true` yap
- [ ] CORS allowed-origins'i production domain'e ayarla
- [ ] Rate limiting ekle (Redis veya Bucket4j)
- [ ] Logging konfigürasyonunu ayarla
- [ ] Database migration tool ekle (Flyway/Liquibase)

### Frontend

- [ ] `VITE_API_BASE_URL`'i production URL'e değiştir
- [ ] Error handling'i iyileştir
- [ ] Loading states ekle
- [ ] Token refresh mekanizması ekle
- [ ] Remember me fonksiyonalitesi ekle

## 🔐 Güvenlik Notları

1. **Cookie Settings**:
   - Development: `secure: false` (HTTP için)
   - Production: `secure: true` (HTTPS zorunlu)

2. **CORS**:
   - Sadece güvendiğiniz domain'lere izin verin
   - Wildcard (`*`) kullanmayın

3. **Token Expiration**:
   - Access token: Kısa (15 dakika)
   - Refresh token: Orta (7 gün)
   - Remember me için farklı süre kullanabilirsiniz

4. **Rate Limiting**:
   - Frontend rate limiting yeterli değil
   - Backend'de mutlaka rate limiting olmalı

## 📚 Daha Fazla Bilgi

- Backend README: `backend/README.md`
- Security dokümantasyonu: `SECURITY.md`
- API endpoint'leri: `backend/README.md` içinde

## 💡 İpuçları

1. **Browser DevTools Kullanın**:
   - Network tab: API çağrılarını izleyin
   - Application > Cookies: Cookie'leri kontrol edin
   - Console: Hata mesajlarını görün

2. **Backend Loglarını İzleyin**:
   ```bash
   cd backend
   mvn spring-boot:run
   # Console'da tüm istekler loglanır
   ```

3. **H2 Console** (Development):
   ```
   URL: http://localhost:3000/h2-console
   JDBC URL: jdbc:h2:mem:galaxydb
   Username: sa
   Password: (boş)
   ```

4. **Postman/Insomnia Kullanın**:
   - API'yi test edin
   - Cookie'leri manuel kontrol edin
   - Request/Response'ları inceleyin

## 🎯 Sonraki Adımlar

1. ✅ Backend'i çalıştırın
2. ✅ Frontend'i çalıştırın
3. ✅ Admin ile login olun
4. ✅ Browser DevTools'da cookie'leri kontrol edin
5. ✅ Logout yapın ve cookie'lerin silindiğini görün
6. 🚀 Kendi özelliklerinizi ekleyin!

---

**Sorularınız için**: Backend veya frontend kodlarında yorumlar ve dokümantasyon mevcuttur.


