import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/catalog');
    } catch (err) {
      setError(String(err) || "Login failed");
    }
  };

  return (
    <div className="login-page">
      
      <div className="top-bar">
        <img src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
        <button className="register-button" onClick={() => navigate('/register')}>Register</button>
      </div>

      {/* Back arrow */}
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/589/654/small/40_436.jpg"
        alt="Back"
        className="back-arrow-button"
        onClick={() => window.history.back()}
      />

      {/* Login block where users put in their information */}
      <div className="login-in-block">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
        </div>

        {error && <div>{error}</div>}

        <button className="sign-in-btn" onClick={handleLogin}>Sign In</button>
      </div>

      {/* Sign in header labeled "Sign in" above block where user's put in their information */}
      <div className="sign-in-block">Sign In</div>
    </div>
  );
}
