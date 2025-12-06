# Galaksi Login - React + Three.js

Uzay ve galaksi temalı güvenli login sayfası. React ve Three.js kullanılarak geliştirilmiştir.

## Özellikler

- 🌌 Gerçekçi galaksi animasyonu (Three.js)
- ⭐ 8000+ yıldız parçacığı
- 🎨 Turuncu-sarı geçişli renkler
- 📱 Responsive tasarım
- ⚡ SPA (Single Page Application) - sayfa yenilenmeden içerik değişimi
- 🔒 Güvenlik önlemleri (XSS, CSRF, Rate Limiting, Input Validation)
- 👤 Rol tabanlı erişim kontrolü (RBAC)
- 🔐 Güvenli authentication ve token yönetimi

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## Proje Yapısı

```
src/
├── components/
│   ├── GalaxyBackground.jsx  # Three.js galaksi animasyonu
│   ├── LoginCard.jsx          # Login formu
│   └── WelcomeCard.jsx        # Hoş geldiniz ekranı
├── App.jsx                    # Ana uygulama
├── main.jsx                   # React entry point
└── styles.css                 # CSS stilleri
```

## Teknolojiler

- **React 18** - UI framework
- **Three.js** - 3D grafikler
- **Vite** - Build tool
- **Vanilla CSS** - Stil yönetimi

## Kullanım

1. `npm install` ile bağımlılıkları yükleyin
2. `npm run dev` ile geliştirme sunucusunu başlatın
3. Tarayıcıda `http://localhost:5173` adresine gidin

## Güvenlik

Bu uygulama production-ready güvenlik önlemleri içerir:

- ✅ XSS koruması
- ✅ Input sanitization ve validation
- ✅ Rate limiting (frontend)
- ✅ CSRF token yönetimi
- ✅ Güvenli token storage
- ✅ Rol tabanlı erişim kontrolü
- ✅ Password validation
- ✅ Secure API calls

**ÖNEMLİ**: Frontend güvenlik önlemleri yeterli değildir! Backend'de mutlaka tüm güvenlik kontrolleri yapılmalıdır. Detaylar için `SECURITY.md` dosyasına bakın.

## Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri ayarlayın:

```bash
cp .env.example .env
```

## Notlar

- Three.js ES Modules kullanıyor, bu yüzden HTTP server gerekiyor
- Vite otomatik olarak sunucu sağlar
- Production build için `npm run build` kullanın
- **Backend API gereklidir** - API endpoint'leri `src/config/api.js` dosyasında yapılandırılır

