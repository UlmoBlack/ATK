# 🌌 Galaxy Auth - Proje Yapısı

## 📂 Genel Yapı

```
Cursor/
├── frontend/ (React + Vite + Three.js)
│   ├── src/
│   │   ├── components/
│   │   │   ├── GalaxyBackground.jsx
│   │   │   ├── LoginCard.jsx
│   │   │   └── WelcomeCard.jsx
│   │   ├── config/
│   │   │   └── api.js ⭐ (Backend entegrasyonu)
│   │   ├── hooks/
│   │   │   ├── useAuth.js ⭐ (Authentication)
│   │   │   └── useRateLimit.js
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   └── security.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/ (Spring Boot + JWT + HttpOnly Cookies)
│   ├── src/main/java/com/galaxy/auth/
│   │   ├── GalaxyAuthApplication.java ⭐
│   │   ├── config/
│   │   │   ├── SecurityConfig.java ⭐
│   │   │   ├── CorsConfig.java ⭐
│   │   │   └── DataInitializer.java
│   │   ├── controller/
│   │   │   └── AuthController.java ⭐
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── LoginResponse.java
│   │   │   ├── UserDto.java
│   │   │   ├── RefreshTokenRequest.java
│   │   │   └── ApiResponse.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Role.java
│   │   │   └── RefreshToken.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── RoleRepository.java
│   │   │   └── RefreshTokenRepository.java
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java ⭐
│   │   │   └── JwtAuthenticationFilter.java ⭐
│   │   ├── service/
│   │   │   ├── AuthService.java ⭐
│   │   │   ├── RefreshTokenService.java
│   │   │   └── UserDetailsServiceImpl.java
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── InvalidTokenException.java
│   │   └── util/
│   │       └── CookieUtil.java ⭐
│   ├── src/main/resources/
│   │   └── application.yml ⭐
│   ├── pom.xml
│   ├── README.md
│   └── QUICK_START.md
│
├── INTEGRATION_GUIDE.md ⭐⭐⭐
├── SECURITY.md
├── README.md
└── .env (oluşturulacak)
```

⭐ = Önemli dosyalar
⭐⭐⭐ = Mutlaka okunmalı!

## 🎯 Temel Akış

### 1. Login Akışı

```
Frontend (LoginCard)
    ↓ username + password
[POST /api/auth/login]
    ↓
Backend (AuthController)
    ↓ Spring Security Authentication
Backend (AuthService)
    ↓ Password check + JWT generation
Backend (CookieUtil)
    ↓ Set HttpOnly cookies
Frontend
    ↓ User bilgisi + Success message
    ✓ Login başarılı (cookie'ler tarayıcıda)
```

### 2. Korumalı Endpoint Akışı

```
Frontend
    ↓ credentials: 'include'
[GET /api/auth/me]
    ↓
Backend (JwtAuthenticationFilter)
    ↓ Cookie'den token'ı al
Backend (JwtTokenProvider)
    ↓ Token'ı validate et
Backend (SecurityContext)
    ↓ User'ı context'e ekle
Backend (AuthController)
    ↓ User bilgisi dön
Frontend
    ✓ User bilgisi alındı
```

### 3. Logout Akışı

```
Frontend (WelcomeCard)
    ↓ logout()
[POST /api/auth/logout]
    ↓
Backend (AuthController)
    ↓ Revoke refresh tokens
Backend (CookieUtil)
    ↓ Clear cookies
Frontend
    ↓ Clear local storage
    ✓ Logout başarılı
```

## 🔑 Anahtar Kavramlar

### Frontend

- **useAuth Hook**: Merkezi authentication yönetimi
- **credentials: 'include'**: HttpOnly cookie'ler için zorunlu
- **Token management**: Backend tarafından yönetiliyor (cookie'lerde)
- **XSS Protection**: escapeHtml() ve input sanitization
- **Rate Limiting**: Frontend ve backend tarafında

### Backend

- **JWT Token**: Access (15dk) + Refresh (7 gün)
- **HttpOnly Cookies**: XSS koruması için
- **Spring Security**: Authentication + Authorization
- **BCrypt**: Password hashing (strength: 12)
- **RBAC**: Role-based access control
- **Account Lockout**: 5 başarısız deneme sonrası 15dk kilitleme

## 🔐 Güvenlik Katmanları

1. **Frontend**
   - Input validation
   - XSS protection (escapeHtml)
   - Rate limiting
   - CSRF token

2. **Network**
   - HTTPS (production)
   - CORS policy
   - Credentials: include

3. **Backend**
   - JWT validation
   - HttpOnly cookies
   - Spring Security
   - Password hashing
   - Account lockout
   - Token rotation

4. **Database**
   - Prepared statements
   - Hashed passwords
   - Token revocation

## 📡 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | ❌ | Login |
| `/auth/logout` | POST | ✅ | Logout |
| `/auth/me` | GET | ✅ | Get user info |
| `/auth/refresh` | POST | ❌ | Refresh token |

## 🚀 Başlatma Sırası

1. **Backend'i başlat** (Port 3000)
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Frontend'i başlat** (Port 5173)
   ```bash
   npm run dev
   ```

3. **Login ol**
   ```
   Username: admin
   Password: Admin123!
   ```

## 📚 Dokümantasyon

- **Backend**: `backend/README.md`
- **Entegrasyon**: `INTEGRATION_GUIDE.md` ⭐⭐⭐
- **Hızlı Başlangıç**: `backend/QUICK_START.md`
- **Güvenlik**: `SECURITY.md`

## 🎓 Öğrenme Kaynakları

### Backend (Spring Boot)
- Spring Security: https://spring.io/projects/spring-security
- JWT: https://jwt.io/
- BCrypt: https://github.com/spring-projects/spring-security

### Frontend (React)
- React Hooks: https://react.dev/reference/react
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- HttpOnly Cookies: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

## 💡 Best Practices

### DO ✅
- `credentials: 'include'` kullan
- HTTPS kullan (production)
- Error handling yap
- Input validation yap
- Token'ları cookie'de sakla
- CORS doğru yapılandır

### DON'T ❌
- Token'ları localStorage'da saklama
- `credentials: 'include'` unutma
- CORS'ta wildcard (`*`) kullanma
- Error mesajlarında hassas bilgi verme
- Production'da development ayarlarını kullanma

## 🔧 Geliştirme İpuçları

1. **Browser DevTools**
   - Network tab: API çağrılarını izle
   - Application > Cookies: Cookie'leri kontrol et
   - Console: Hataları gör

2. **Backend Logs**
   - Console'da tüm istekler loglanır
   - Debug level: `com.galaxy: DEBUG`

3. **H2 Console**
   - URL: `http://localhost:3000/h2-console`
   - Database'i canlı görüntüle

4. **Postman/Insomnia**
   - API'yi test et
   - Cookie'leri manuel kontrol et

## 🎯 Production Checklist

### Backend
- [ ] JWT secret environment variable
- [ ] PostgreSQL kullan (H2 yerine)
- [ ] HTTPS aktif et
- [ ] `secure: true` (cookies)
- [ ] Rate limiting ekle
- [ ] Logging konfigüre et
- [ ] Health check endpoint

### Frontend
- [ ] `VITE_API_BASE_URL` production URL
- [ ] Error handling iyileştir
- [ ] Loading states ekle
- [ ] Auto token refresh
- [ ] Analytics ekle

---

**Başarılar!** 🚀


