import { useState, useEffect, useCallback } from 'react';
import { 
  setUserData,
  getUserData,
  clearAuthData
} from '../utils/auth';
import { loginAPI, logoutAPI, getUserInfoAPI, refreshTokenAPI } from '../config/api';

/**
 * Authentication Hook
 * Token'lar artık HttpOnly cookie'lerde saklanıyor (backend tarafından yönetiliyor)
 */

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cookie'den token kontrolü ve kullanıcı bilgilerini yükle
  useEffect(() => {
    const checkAuth = async () => {
      // Backend çalışmazsa timeout ile loading'i kapat
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        console.warn('Backend yanıt vermiyor, login sayfası gösteriliyor');
      }, 3000); // 3 saniye timeout

      try {
        // Backend cookie'yi otomatik kontrol eder
        const userData = await getUserInfoAPI();
        clearTimeout(timeoutId);
        setUser(userData);
        setIsAuthenticated(true);
        setUserData(userData);
        setIsLoading(false);
      } catch (error) {
        // Token geçersiz veya yok - bu normal (ilk yükleme)
        clearTimeout(timeoutId);
        console.debug('Not authenticated:', error.message);
        clearAuthData();
        setIsAuthenticated(false);
        setUser(null);
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
      await logoutAPI(); // Backend cookie'leri temizler
      
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

