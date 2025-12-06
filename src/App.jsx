import SpaceBackground from './components/SpaceBackground';
import LoginCard from './components/LoginCard';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useAuth';
import './styles.css';

function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const handleLogin = async (username, password) => {
    const result = await login(username, password);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <SpaceBackground />
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#93c5fd',
          zIndex: 1000,
          fontFamily: "'Inter', sans-serif",
          fontSize: '18px',
          fontWeight: '300'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <SpaceBackground />
      {isAuthenticated && user ? (
        <Dashboard 
          username={user.username} 
          userRole={user.role}
          onLogout={logout} 
        />
      ) : (
        <LoginCard onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

