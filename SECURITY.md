# Güvenlik Dokümantasyonu

Bu dokümantasyon, uygulamanın güvenlik önlemlerini ve best practice'lerini açıklar.

## Frontend Güvenlik Önlemleri

### 1. XSS (Cross-Site Scripting) Koruması

- **Input Sanitization**: Tüm kullanıcı girdileri `sanitizeInput()` ve `escapeHtml()` fonksiyonları ile temizlenir
- **React'in Built-in XSS Koruması**: React otomatik olarak JSX içindeki değerleri escape eder
- **Manuel Escape**: Kritik yerlerde `escapeHtml()` kullanılır

### 2. Input Validation

- **Kullanıcı Adı**: Sadece alfanumerik, nokta, alt çizgi ve tire karakterlerine izin verilir
- **Şifre**: Minimum 8 karakter, maksimum 128 karakter
- **Real-time Validation**: Kullanıcı yazarken anlık doğrulama
- **Backend Validation**: Frontend validation sadece UX içindir, backend'de mutlaka tekrar doğrulanmalıdır

### 3. Rate Limiting

- **Frontend Rate Limiting**: LocalStorage kullanılarak login denemeleri sınırlanır
- **Maksimum Deneme**: 5 deneme / 15 dakika
- **Backend Rate Limiting**: Mutlaka backend'de de rate limiting uygulanmalıdır

### 4. Token Yönetimi

- **Access Token**: localStorage'da saklanır (Production'da httpOnly cookie tercih edilmeli)
- **Refresh Token**: localStorage'da saklanır
- **Token Validation**: JWT token'ların geçerliliği kontrol edilir
- **Auto Refresh**: Token süresi dolduğunda otomatik yenileme

### 5. CSRF (Cross-Site Request Forgery) Koruması

- **CSRF Token**: Her session için benzersiz token oluşturulur
- **Token Gönderimi**: Tüm API isteklerinde CSRF token gönderilir
- **Backend Validation**: Backend'de CSRF token doğrulanmalıdır

### 6. Güvenli API Çağrıları

- **HTTPS**: Production'da mutlaka HTTPS kullanılmalı
- **Credentials**: Cookie'ler için `credentials: 'include'` kullanılır
- **Error Handling**: Hata mesajları kullanıcıya güvenli şekilde gösterilir
- **401 Handling**: Unauthorized durumunda otomatik logout

### 7. Rol Tabanlı Erişim Kontrolü (RBAC)

- **Rol Hiyerarşisi**: admin > moderator > user > guest
- **Rol Kontrolü**: `hasRole()` ve `hasAnyRole()` fonksiyonları
- **Backend Validation**: Frontend kontrolü sadece UX içindir, backend'de mutlaka doğrulanmalıdır

## Backend Güvenlik Gereksinimleri

### 1. Authentication

- **Password Hashing**: bcrypt veya Argon2 kullanılmalı (salt + hash)
- **JWT Tokens**: Access token (kısa süreli) + Refresh token (uzun süreli)
- **Token Expiration**: Access token 15 dakika, Refresh token 7 gün
- **httpOnly Cookies**: Production'da token'lar httpOnly cookie'de saklanmalı

### 2. Authorization

- **Role-Based Access Control**: Her endpoint için rol kontrolü
- **Permission System**: Granüler izin sistemi
- **Middleware**: Authentication ve authorization middleware'leri

### 3. Input Validation

- **Server-Side Validation**: Tüm inputlar backend'de doğrulanmalı
- **SQL Injection**: Parameterized queries kullanılmalı
- **NoSQL Injection**: Input sanitization
- **File Upload**: Dosya tipi, boyut ve içerik kontrolü

### 4. Rate Limiting

- **API Rate Limiting**: IP bazlı rate limiting
- **Login Rate Limiting**: Account bazlı rate limiting
- **Distributed Rate Limiting**: Redis kullanılmalı (production)

### 5. Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

### 6. Database Security

- **Prepared Statements**: SQL injection koruması
- **Encryption**: Hassas veriler şifrelenmeli
- **Backup Encryption**: Yedekler şifrelenmeli
- **Access Control**: Database kullanıcıları minimum yetki ile

### 7. Logging ve Monitoring

- **Security Logging**: Tüm güvenlik olayları loglanmalı
- **Failed Login Attempts**: Başarısız login denemeleri
- **Suspicious Activity**: Şüpheli aktiviteler
- **Alert System**: Anormal aktiviteler için uyarı sistemi

## Güvenlik Checklist

### Frontend
- [x] Input sanitization
- [x] XSS koruması
- [x] Rate limiting (frontend)
- [x] Token yönetimi
- [x] CSRF token
- [x] Secure API calls
- [x] Error handling
- [x] Password validation

### Backend (Uygulanmalı)
- [ ] Password hashing (bcrypt/Argon2)
- [ ] JWT token management
- [ ] httpOnly cookies
- [ ] Role-based access control
- [ ] Server-side input validation
- [ ] SQL injection koruması
- [ ] Rate limiting (backend)
- [ ] Security headers
- [ ] HTTPS enforcement
- [ ] Security logging
- [ ] Session management
- [ ] Account lockout mechanism

## Önemli Notlar

1. **Frontend güvenlik önlemleri yeterli değildir!** Backend'de mutlaka tüm kontroller yapılmalıdır.
2. **Token'lar localStorage'da saklanmamalı** - Production'da httpOnly cookie kullanılmalı
3. **HTTPS zorunludur** - Production'da mutlaka HTTPS kullanılmalı
4. **Rate limiting backend'de yapılmalı** - Frontend rate limiting bypass edilebilir
5. **Input validation backend'de yapılmalı** - Frontend validation sadece UX içindir
6. **Error mesajları hassas bilgi içermemeli** - Kullanıcıya genel hata mesajları gösterilmeli

## Güvenlik Güncellemeleri

- Düzenli olarak bağımlılıklar güncellenmeli
- Güvenlik açıkları takip edilmeli
- Penetrasyon testleri yapılmalı
- Code review süreçleri uygulanmalı


