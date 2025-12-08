import "./Landing.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Landing() {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const heroElement = heroRef.current;
        const descElement = descRef.current;

        if (heroElement) observer.observe(heroElement);
        if (descElement) observer.observe(descElement);

        return () => {
            if (heroElement) observer.unobserve(heroElement);
            if (descElement) observer.unobserve(descElement);
        };
    }, []);

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
    <div className="hero-section" ref={heroRef}>
    <div className="hero-content fade-in">
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
            <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="app-image slide-in-left" />
            <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="app-image slide-in-right" />
    </div>
    </div>

{/* Description of app section */}
<div className="description-section" ref={descRef}>
  <h1 className="description-title">App Dev Hackathon</h1>
  <div className="descriptions">
    <div className="description2 card-hover">
      <div className="info-icon">i</div>
      <h2 className="tech-description">Technologies Used</h2>
      <p className="tech-text">Built with React, TypeScript, Firebase Authentication, MongoDB, FastAPI, and Tailwind CSS for a modern, scalable experience.</p>
    </div>
    <div className="description1 card-hover">
      <div className="info-icon">i</div>
      <h2 className="app-description">App Description</h2>
      <p className="app-text">The app assigns three random daily goals, consisting of small tasks or good habits. Each time a user completes a goal, they receive a 'pack' that can be opened to reveal random trading cards or badges, motivating them to complete their goals every day. When possible, users can also trade these cards with one another.</p>
    </div>
    <div className="description3 card-hover">
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
