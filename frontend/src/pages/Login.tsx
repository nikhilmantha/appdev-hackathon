import "./Login.css";
import { useNavigate } from 'react-router-dom';

export default function Catalog() {
          const navigate = useNavigate();  // ADD THIS LINE
  return (
    <div className="login-page">
      <div className="top-bar">
                <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
              <button className="register-button" onClick={() => navigate('/register')}>Register</button>

      </div>

    <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/589/654/small/40_436.jpg"
        alt="Back"
        className="back-arrow-button"
        onClick={() => window.history.back()} // optional: go back on click
    />

      <div className="login-in-block">

        <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="example@gmail.com" />
        </div>

        <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="**************" />
        </div>

        <button className="sign-in-btn">Sign In</button>


      </div>
      <div className="sign-in-block">Sign In</div>
    </div>
  );
}
