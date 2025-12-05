import { useNavigate } from 'react-router-dom';
import "./Tasks.css";

export default function Tasks() {
  const navigate = useNavigate();
  return (
    <div className="tasks-page">
      <div className="top-bar">
              <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
             <div className = "button-group">
          <button className="profile-button" onClick={() => navigate('/profile')}>Profile</button>
          <button className="catalog-button" onClick={() => navigate('/catalog')}>Catalog</button>
        </div> 
      </div>    

      <div className="tasks-box">Tasks</div>

<div className="tasks-section">
  <h1 className="tasks-title">Welcome User, Here are your goals for the day</h1>
  <div className="goals-container">
    <h2 className="goals-heading">Complete All Your Goals and You'll Get a New Card!</h2>
    <div className="goal-box">
      <input type="checkbox" id="goal1" className="goal-checkbox" />
      <label htmlFor="goal1" className="goal-label">This is goal 1</label>
    </div>
    <div className="goal-box">
      <input type="checkbox" id="goal2" className="goal-checkbox" />
      <label htmlFor="goal2" className="goal-label">This is goal 2</label>
    </div>
    <div className="goal-box">
      <input type="checkbox" id="goal3" className="goal-checkbox" />
      <label htmlFor="goal3" className="goal-label">This is goal 3</label>
    </div>
  </div>
</div>

</div>
  );
}
