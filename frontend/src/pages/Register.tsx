import "./Register.css";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        setUsername("");
        setEmail("");
      } else {
        setMessage(`Error: ${data.detail}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error: Could not connect to server");
    }
  }

  return (
    <div className="register-page">
      {/* top bar */}
      <div className="top-bar">
        <img src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
        <button className="signin-button" onClick={() => navigate('/login')}>Sign In</button>
      </div>

      {/* back arrow */}
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/589/654/small/40_436.jpg"
        alt="Back"
        className="back-arrow-button"
        onClick={() => navigate('/')}
      />

      {/* Where users put their registration information */}
      <form className="registration-block" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="example1234"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

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

        {message && <div style={{ color: message.includes('Error') ? '#ff6b6b' : '#4caf50', textAlign: 'center' }}>{message}</div>}

        <button className="register-btn" type="submit">Register</button>
      </form>

      {/* registration block header */}
      <div className="register-box">Register</div>
    </div>
  );
}
