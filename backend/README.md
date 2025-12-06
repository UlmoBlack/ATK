# Galaxy Auth Backend - Spring Boot

Modern, güvenli authentication backend sistemi. JWT tabanlı authentication, HttpOnly cookie desteği ve rol tabanlı erişim kontrolü (RBAC).

## 🚀 Özellikler

- ✅ JWT-based authentication (Access + Refresh tokens)
- ✅ HttpOnly cookie support (XSS koruması)
- ✅ Role-based access control (RBAC)
- ✅ BCrypt password hashing
- ✅ Account lockout mechanism (brute-force koruması)
- ✅ Token rotation (refresh token yenileme)
- ✅ CORS configuration
- ✅ H2/PostgreSQL database support
- ✅ Global exception handling
- ✅ Input validation
- ✅ Scheduled token cleanup

## 📋 Gereksinimler

- Java 17+
- Maven 3.8+
- (Opsiyonel) PostgreSQL 14+ (production için)

## 🛠️ Kurulum

### 1. Projeyi klonlayın veya indirin

```bash
cd backend
```

### 2. Bağımlılıkları yükleyin

```bash
mvn clean install
```

### 3. Uygulamayı çalıştırın

```bash
mvn spring-boot:run
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🔧 Konfigürasyon

### application.yml

Temel ayarlar `src/main/resources/application.yml` dosyasında:

```yaml
server:
  port: 3000
  servlet:
    context-path: /api

jwt:
  secret: YOUR_SECRET_KEY_HERE # PRODUCTION'DA ENV VARIABLE KULLANIN!
  access-token-expiration: 900000 # 15 dakika
  refresh-token-expiration: 604800000 # 7 gün

cors:
  allowed-origins: http://localhost:5173,http://localhost:3000
```

### Production için önemli notlar:

1. **JWT Secret**: Environment variable kullanın
   ```bash
   export JWT_SECRET=your-256-bit-secret-key
   ```

2. **Database**: H2 yerine PostgreSQL kullanın
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/galaxydb
       username: postgres
       password: yourpassword
   ```

3. **HTTPS**: Secure cookies için HTTPS zorunludur
   ```yaml
   jwt:
     cookie:
       secure: true
   ```

## 📡 API Endpoints

### Base URL: `http://localhost:3000/api`

### Authentication Endpoints

#### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin123!"
}

Response:
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@galaxy.com",
    "role": "ADMIN",
    "roles": ["ADMIN"]
  },
  "message": "Giriş başarılı"
}

Cookies:
- galaxy_access_token (HttpOnly)
- galaxy_refresh_token (HttpOnly)
```

#### 2. Logout
```http
POST /auth/logout
Authorization: Bearer {token}
# veya cookie ile otomatik

Response:
{
  "success": true,
  "message": "Çıkış başarılı"
}
```

#### 3. Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
# veya cookie ile otomatik

Response:
{
  "id": 1,
  "username": "admin",
  "email": "admin@galaxy.com",
  "role": "ADMIN",
  "roles": ["ADMIN"]
}
```

#### 4. Refresh Token
```http
POST /auth/refresh
Cookie: galaxy_refresh_token={refresh_token}

# Alternatif (cookie yoksa):
{
  "refreshToken": "your-refresh-token"
}

Response:
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@galaxy.com",
    "role": "ADMIN",
    "roles": ["ADMIN"]
  },
  "message": "Token yenilendi"
}

Cookies:
- galaxy_access_token (yeni token)
- galaxy_refresh_token (yeni token)
```

## 👥 Default Kullanıcılar

Uygulama ilk çalıştırıldığında otomatik olarak oluşturulur:

### Admin User
- **Username**: `admin`
- **Password**: `Admin123!`
- **Role**: ADMIN

### Test User
- **Username**: `testuser`
- **Password**: `Test123!`
- **Role**: USER

## 🔐 Güvenlik Özellikleri

### 1. Password Hashing
- BCrypt (strength: 12)
- Salt otomatik eklenir

### 2. JWT Token Security
- Access Token: 15 dakika (kısa süreli)
- Refresh Token: 7 gün (database'de saklanır)
- Token rotation (her refresh'te yeni token)

### 3. HttpOnly Cookies
- XSS saldırılarına karşı koruma
- JavaScript ile erişilemez
- Secure flag (HTTPS için)
- SameSite: Lax (CSRF koruması)

### 4. Account Lockout
- Maksimum 5 başarısız deneme
- 15 dakika lockout süresi
- Otomatik unlock

### 5. CORS
- Sadece belirtilen origin'lere izin
- Credentials support (cookies için)

### 6. Input Validation
- Jakarta Validation
- Custom validators
- Global exception handling

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    failed_login_attempts INT DEFAULT 0,
    lockout_end_time TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Roles Table
```sql
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) UNIQUE NOT NULL,
    description VARCHAR(100),
    level INT NOT NULL
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🧪 Testing

### H2 Console (Development)
```
URL: http://localhost:3000/h2-console
JDBC URL: jdbc:h2:mem:galaxydb
Username: sa
Password: (boş)
```

### Postman/cURL Examples

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}' \
  -c cookies.txt
```

#### Get User Info
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

#### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

## 📦 Proje Yapısı

```
backend/
├── src/main/java/com/galaxy/auth/
│   ├── GalaxyAuthApplication.java (Main class)
│   ├── config/
│   │   ├── SecurityConfig.java (Spring Security)
│   │   ├── CorsConfig.java (CORS)
│   │   └── DataInitializer.java (Initial data)
│   ├── controller/
│   │   └── AuthController.java (REST endpoints)
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   ├── UserDto.java
│   │   ├── RefreshTokenRequest.java
│   │   └── ApiResponse.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Role.java
│   │   └── RefreshToken.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── RoleRepository.java
│   │   └── RefreshTokenRepository.java
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   └── JwtAuthenticationFilter.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── RefreshTokenService.java
│   │   └── UserDetailsServiceImpl.java
│   ├── exception/
│   │   ├── InvalidTokenException.java
│   │   └── GlobalExceptionHandler.java
│   └── util/
│       └── CookieUtil.java
└── src/main/resources/
    └── application.yml
```

## 🔗 Frontend Entegrasyonu

Frontend projenizde (`src/config/api.js`):

```javascript
const API_BASE_URL = 'http://localhost:3000/api';

export async function loginAPI(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Cookie'ler için zorunlu!
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return await response.json();
}
```

**Önemli**: `credentials: 'include'` tüm API çağrılarında olmalı!

## 🐛 Troubleshooting

### CORS Hatası
- `application.yml` içinde frontend URL'ini `cors.allowed-origins`'e ekleyin
- `credentials: 'include'` kullanıldığından emin olun

### Cookie Gönderilmiyor
- `credentials: 'include'` ekleyin
- CORS'ta `allow-credentials: true` olmalı
- Same-origin policy kontrolü yapın

### 401 Unauthorized
- Token süresi dolmuş olabilir (refresh endpoint'i kullanın)
- Cookie'nin expire olmadığından emin olun

### H2 Console Açılmıyor
- `spring.h2.console.enabled: true` kontrol edin
- URL: `/h2-console` (context-path dahil: `/api/h2-console`)

## 📝 License

MIT License

## 👤 Author

Galaxy Auth Backend - Spring Boot 3.2 + Java 17


