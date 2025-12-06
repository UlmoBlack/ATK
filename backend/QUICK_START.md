# 🚀 Hızlı Başlangıç

## Backend'i 5 Dakikada Çalıştırın

### 1. Gereksinimleri Kontrol Edin

```bash
java -version  # Java 17+ olmalı
mvn -version   # Maven 3.8+ olmalı
```

Java yoksa: https://adoptium.net/

### 2. Backend'i Başlatın

```bash
cd backend
mvn spring-boot:run
```

✅ Backend çalışıyor: `http://localhost:3000/api`

### 3. Test Edin

Browser'da: `http://localhost:3000/h2-console`

```
JDBC URL: jdbc:h2:mem:galaxydb
Username: sa
Password: (boş)
```

### 4. API Test

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}' \
  -c cookies.txt

# Get User Info
curl -X GET http://localhost:3000/api/auth/me -b cookies.txt
```

## Frontend ile Entegrasyon

### 1. Environment Dosyası

Proje root'unda `.env` oluşturun:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Frontend'i Başlatın

```bash
# Backend çalışırken, başka bir terminalde:
cd ..  # Proje root'una dön
npm run dev
```

✅ Frontend çalışıyor: `http://localhost:5173`

### 3. Login Olun

```
Username: admin
Password: Admin123!
```

veya

```
Username: testuser
Password: Test123!
```

## 🎉 Tamamlandı!

- Backend: ✅ Çalışıyor
- Frontend: ✅ Çalışıyor
- Login: ✅ Çalışıyor
- Cookie Auth: ✅ Çalışıyor

## 📚 Daha Fazla Bilgi

- Backend README: `backend/README.md`
- Entegrasyon Rehberi: `INTEGRATION_GUIDE.md`
- Güvenlik: `SECURITY.md`

## 🐛 Sorun mu Var?

1. **Port 3000 kullanımda**: `application.yml`'de portu değiştirin
2. **CORS hatası**: Frontend URL'ini `application.yml`'de allowed-origins'e ekleyin
3. **Cookie gönderilmiyor**: `credentials: 'include'` kullandığınızdan emin olun

**Detaylı troubleshooting**: `INTEGRATION_GUIDE.md` dosyasına bakın


