import "./Profile.css";
import { useNavigate } from 'react-router-dom';


export default function Profile() {
      const navigate = useNavigate();  // ADD THIS LINE

  return (
    <div className="profile-page">
      <div className="top-bar">
              <img src = "https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
             <div className = "button-group">
          <button className="task-button" onClick={() => navigate('/tasks')}>Tasks</button>
          <button className="catalog-button" onClick={() => navigate('/catalog')}>Catalog</button>
        </div> 
      </div>    
</div>
  );
}
