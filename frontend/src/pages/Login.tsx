import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Replace with your actual backend URL
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // Log the response for debugging
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store user info (backend returns "id", not "user_id")
      if (data.id) {
        localStorage.setItem('user_id', data.id);
        
        // Navigate to profile page
        console.log('Navigating to profile');
        navigate('/profile');
      } else {
        console.error('No id in response');
        setError('Login response missing user information');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      {/* Top Bar */}
      <div className="top-bar">
        <img 
          src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" 
          alt="app dev logo" 
          className="logo-photo" 
        />
        <button className="register-button" onClick={() => navigate('/register')}>
          Register
        </button>
      </div>

      {/* Back arrow */}
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/589/654/small/40_436.jpg"
        alt="Back"
        className="back-arrow-button"
        onClick={() => navigate('/')}
      />

      {/* Login block where users put in their information */}
      <div className="login-in-block">
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="**************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        <button 
          className="sign-in-btn" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </div>

      {/* Sign in header labeled "Sign in" above block where user's put in their information */}
      <div className="sign-in-block">Sign In</div>
    </div>
  );
}