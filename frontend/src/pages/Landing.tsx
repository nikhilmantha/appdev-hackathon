import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-page">
      <div className="top-bar">
              <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
             <div className = "button-group">
              <button className="about-button">About</button>
              <button className="signin-button">Sign In</button>
              <button className="register-button">Register</button>
        </div> 
      </div>    

    <div className="hero-section">
    <div className="hero-content">
        <h1 className="hero-title">Title</h1>
        <p className="hero-subtitle">subtitle</p>

        <div className="hero-buttons">
            <button className="hero-register">Register</button>
            <button className="hero-signin">Sign In</button>
        </div>
    </div>
    </div>

    <div className="image-section">
        <div className="images">
            <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="app-image" />
            <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="app-image" />
    </div>
    </div>

<div className="description-section">
  <h1 className="description-title">App Dev Hackathon</h1>
  <div className="descriptions">
    <div className="description-row-1">
      <div className="description1">
        <div className="info-icon">i</div>
        <h2 className="app-description">App Description</h2>
        <p className="app-text">This is what our app does.</p>
      </div>
    </div>
    <div className="description-row-2">
      <div className="description2">
        <div className="info-icon">i</div>
        <h2 className="tech-description">Technologies Used</h2>
        <p className="tech-text">This is what technologies we used.</p>
      </div>
      <div className="description3">
        <div className="info-icon">i</div>
        <h2 className="team-description">Team Members</h2>
        <p className="team-text">These are our team members.</p>
      </div>
    </div>
  </div>
</div>

<footer className="footer">
  <p className="footer-text">© 2025 App Dev Hackathon. All rights reserved.</p>
</footer>


    </div>

  );
}
