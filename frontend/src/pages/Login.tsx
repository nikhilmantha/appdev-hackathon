import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if an ID is returned and store it in localStorage
        if (data.id || data.user_id || data.userId) {
          const userId = data.id || data.user_id || data.userId;
          localStorage.setItem('userId', userId);
        }
        
        setMessage("Login successful!");
        setEmail("");
        setPassword("");
      } else {
        setMessage(`Error: ${data.detail}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error: Could not connect to server");
    }
  }

  return (
    <div className="login-page">
      {/* Top Bar */}
      <div className="top-bar">
        <img src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
        <button className="register-button" onClick={() => navigate('/register')}>Register</button>
      </div>

      {/* Back arrow */}
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/589/654/small/40_436.jpg"
        alt="Back"
        className="back-arrow-button"
        onClick={() => navigate('/')}
      />

      {/* Login block where users put in their information */}
      <form className="login-in-block" onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            required
          />
        </div>

        {message && <div style={{ color: message.includes('Error') ? '#ff6b6b' : '#4caf50', textAlign: 'center' }}>{message}</div>}

        <button className="sign-in-btn" type="submit">Sign In</button>
      </form>

      {/* Sign in header labeled "Sign in" above block where user's put in their information */}
      <div className="sign-in-block">Sign In</div>
    </div>
  );
}
