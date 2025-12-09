import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Catalog.css";

// Dynamically import all card images
const imageFiles = import.meta.glob("../assets/cards/*.png", { eager: true });

// Use .map + .reduce to create a record of cardName -> src
const cardImages: Record<string, string> = Object.keys(imageFiles)
  .map((path) => {
    const key = path.split("/").pop()!.replace(".png", "");
    return { [key]: (imageFiles[path] as any).default };
  })
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

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

      <div className="catalog-box">Catalog</div>

      <div className="cards-section">
        <h1 className="cards-title">Take A Look at All the Available Cards</h1>
        <div className="cards">
          {cards.map((card) => (
            <div key={card._id} className="card-item">
              <img
                src={cardImages[card.name]}
                alt={card.name}
                className="card-image"
              />
              <div className="card-text-content">
                <h2 className="card-title">{card.name}</h2>
                <p className="card-text">{card.rarity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
