import "./Catalog.css";
import { useNavigate } from 'react-router-dom';

export default function Catalog() {
  const navigate = useNavigate();
  return (
    <div className="catalog-page">
      {/* Top Bar */}
      <div className="top-bar">
        <img src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
        <div className="button-group">
          <button className="profile-button" onClick={() => navigate('/profile')}>Profile</button>
          <button className="tasks-button" onClick={() => navigate('/tasks')}>Tasks</button>
        </div>
      </div>

      {/* Back arrow */}
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/589/654/small/40_436.jpg"
        alt="Back"
        className="back-arrow-button"
        onClick={() => navigate('/')}
      />

      {/* Catalog Header */}
      <div className="catalog-box">Catalog</div>

      {/* Cards Section */}
      <div className="cards-section">
        <h1 className="cards-title">Take A Look at All the Available Cards</h1>
        <div className="cards">


          <div className="card1">
            <div className="card-left">
              <img src="https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png" alt="placeholder image" className="card1-image" />
              <div className="card-text-content">
                <h2 className="title1">Title</h2>
                <p className="card1-text">This is what card 1 is.</p>
              </div>
            </div>
          </div>

          <div className="card2">
            <div className="card-left">
              <img src="https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png" alt="placeholder image" className="card2-image" />
              <div className="card-text-content">
                <h2 className="title2">Title</h2>
                <p className="card2-text">This is what card 2 is.</p>
              </div>
            </div>
          </div>

          <div className="card3">
            <div className="card-left">
              <img src="https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png" alt="placeholder image" className="card3-image" />
              <div className="card-text-content">
                <h2 className="title3">Title</h2>
                <p className="card3-text">This is what card 3 is.</p>
              </div>
            </div>
          </div>

          <div className="card4">
            <div className="card-left">
              <img src="https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png" alt="placeholder image" className="card4-image" />
              <div className="card-text-content">
                <h2 className="title4">Title</h2>
                <p className="card4-text">This is what card 3 is.</p>
              </div>
            </div>
          </div>

          <div className="card5">
            <div className="card-left">
              <img src="https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png" alt="placeholder image" className="card5-image" />
              <div className="card-text-content">
                <h2 className="title5">Title</h2>
                <p className="card5-text">This is what card 5 is.</p>
              </div>
            </div>
          </div>

          <div className="card6">
            <div className="card-left">
              <img src="https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png" alt="placeholder image" className="card6-image" />
              <div className="card-text-content">
                <h2 className="title6">Title</h2>
                <p className="card6-text">This is what card 6 is.</p>
              </div>
            </div>
          </div>

          <div className="card7">
            <div className="card-left">
              <img src="https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png" alt="placeholder image" className="card7-image" />
              <div className="card-text-content">
                <h2 className="title7">Title</h2>
                <p className="card7-text">This is what card 7 is.</p>
              </div>
            </div>
          </div>

          <div className="card8">
            <div className="card-left">
              <img src="https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png" alt="placeholder image" className="card8-image" />
              <div className="card-text-content">
                <h2 className="title8">Title</h2>
                <p className="card8-text">This is what card 8 is.</p>
              </div>
            </div>
          </div>

          <div className="card9">
            <div className="card-left">
              <img src="https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png" alt="placeholder image" className="card9-image" />
              <div className="card-text-content">
                <h2 className="title9">Title</h2>
                <p className="card9-text">This is what card 9 is.</p>
              </div>
            </div>
          </div>




        </div>
      </div>
    </div>

  );
}
