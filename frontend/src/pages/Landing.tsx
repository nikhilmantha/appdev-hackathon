import "./Landing.css";
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();
  return (
    <div className="landing-page">
      {/* Top Bar */}
      <div className="top-bar">
              <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
             <div className = "button-group">
              <button className="about-button" onClick={() => navigate('/landing')}>About</button>
              <button className="signin-button" onClick={() => navigate('/login')}>Sign In</button>
              <button className="register-button" onClick={() => navigate('/register')}>Register</button>
        </div> 
      </div>    

{/* Title Block */}
    <div className="hero-section">
    <div className="hero-content">
        <h1 className="hero-title">Title</h1>
        <p className="hero-subtitle">subtitle</p>

        <div className="hero-buttons">
            <button className="hero-register" onClick={() => navigate('/register')}>Register</button>
            <button className="hero-signin" onClick={() => navigate('/login')}>Sign In</button>
        </div>
    </div>
    </div>

{/* Image section */}
    <div className="image-section">
        <div className="images">
            <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="app-image" />
            <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="app-image" />
    </div>
    </div>

{/* Description of app section */}
<div className="description-section">
  <h1 className="description-title">App Dev Hackathon</h1>
  <div className="descriptions">
    <div className="description2">
      <div className="info-icon">i</div>
      <h2 className="tech-description">Technologies Used</h2>
      <p className="tech-text">Built with React, TypeScript, Firebase Authentication, MongoDB, FastAPI, and Tailwind CSS for a modern, scalable experience.</p>
    </div>
    <div className="description1">
      <div className="info-icon">i</div>
      <h2 className="app-description">App Description</h2>
      <p className="app-text">The app assigns three random daily goals, consisting of small tasks or good habits. Each time a user completes a goal, they receive a 'pack' that can be opened to reveal random trading cards or badges, motivating them to complete their goals every day. When possible, users can also trade these cards with one another.</p>
    </div>
    <div className="description3">
      <div className="info-icon">i</div>
      <h2 className="team-description">Team Members</h2>
      <p className="team-text">Evan, Vishnu, Nikhil, Sonaya, Victoria</p>
    </div>
  </div>
</div>

{/* Footer */}
<footer className="footer">
  <p className="footer-text">© 2025 App Dev Hackathon. All rights reserved.</p>
</footer>


    </div>

  );
}
