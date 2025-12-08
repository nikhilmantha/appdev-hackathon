import "./Catalog.css";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";

interface Card {
  _id: string;
  name: string;
  rarity: string;
}

export default function Catalog() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:8000/catalog");
        const data: Card[] = await response.json();
        setCards(data);
      } catch (err) {
        console.error("Error fetching catalog cards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <p>Loading catalog...</p>;

  return (
    <div className="catalog-page">
      {/* Top Bar */}
      <div className="top-bar">
        <img
          src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png"
          alt="app dev logo"
          className="logo-photo"
        />
        <div className="button-group">
          <button className="profile-button" onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button className="tasks-button" onClick={() => navigate("/tasks")}>
            Tasks
          </button>
        </div>
      </div>

       {/* Catalog Header */}
      <div className="catalog-box">Catalog</div>

      {/* Cards Section */}
      <div className="cards-section">
        <h1 className="cards-title">Take A Look at All the Available Cards</h1>
        <div className="cards">
          {cards.map((card) => (
            <div key={card._id} className="card-item">
              <div className="card-left">
                <img
                  src={`/cardImages/${card.name}.jpg`}
                  alt={card.name}
                  className="card-image"
                />
                <div className="card-text-content">
                  <h2 className="card-title">{card.name}</h2>
                  <p className="card-text">{card.rarity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
