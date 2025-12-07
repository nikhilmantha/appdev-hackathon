import "./Register.css";
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate(); 
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
      <div className="registration-block">

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input type="username" id="username" placeholder="example1234" />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="example@gmail.com" />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="**************" />
        </div>

        <button className="register-btn">Register</button>


      </div>

      {/* registration block header */}
      <div className="register-box">Register</div>
    </div>
  );
}
