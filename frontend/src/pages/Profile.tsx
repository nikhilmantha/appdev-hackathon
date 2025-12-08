import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Profile.css";

interface Card {
  _id: string;
  user_id: string;
  card_id: string;
  quantity: number;
}

interface Goal {
  _id: string;
  user_id: string;
  goal_id: string;
  assigned_for: string;
  completed?: boolean;
}

interface User {
  _id: string;
  username: string;
  email: string;
  packs_available: number;
  completed_goals: number;
  goals_available: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  
useEffect(() => {
  // MOCK DATA FOR TESTING - replace this whole useEffect later
  setUser({
    _id: "test123",
    username: "testuser",
    email: "test@test.com",
    packs_available: 5,
    completed_goals: 10,
    goals_available: 3
  });
  
  setCards([
    { _id: "1", user_id: "test123", card_id: "card1", quantity: 2 },
    { _id: "2", user_id: "test123", card_id: "card2", quantity: 1 },
    { _id: "3", user_id: "test123", card_id: "card3", quantity: 3 },
    { _id: "4", user_id: "test123", card_id: "card4", quantity: 1 },
    { _id: "5", user_id: "test123", card_id: "card5", quantity: 2 },
    { _id: "6", user_id: "test123", card_id: "card6", quantity: 4 }
  ]);
  
  setGoals([
    { _id: "g1", user_id: "test123", goal_id: "goal1", assigned_for: "2024-12-08", completed: true },
    { _id: "g2", user_id: "test123", goal_id: "goal2", assigned_for: "2024-12-08", completed: true },
    { _id: "g3", user_id: "test123", goal_id: "goal3", assigned_for: "2024-12-07", completed: true },
    { _id: "g4", user_id: "test123", goal_id: "goal4", assigned_for: "2024-12-06", completed: true },
    { _id: "g5", user_id: "test123", goal_id: "goal5", assigned_for: "2024-12-05", completed: true },
    { _id: "g6", user_id: "test123", goal_id: "goal6", assigned_for: "2024-12-04", completed: true }
  ]);
}, []);


  /* useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;
    
    fetch(`http://localhost:8000/profile/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setCards(data.user_cards);
        setGoals(data.user_goals);
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  */
  if (!user) {
    return <p>Loading profile...</p>;
  } 


const cardsPerRow = 3;
const goalsPerRow = 3;

const cardRows = Math.ceil(cards.length / cardsPerRow);
const goalRows = Math.ceil(goals.length / goalsPerRow);

// Calculate dynamic padding based on total rows
const basePadding = 25;
const paddingPerGoalRow = 8; // Adjust based on goal card height
const paddingPerCardRow = 15; // Adjust based on card height (cards are taller)

const dynamicPadding = basePadding + (goalRows * paddingPerGoalRow) + (cardRows * paddingPerCardRow);

  return (
    <>
      <div className="top-bar">
        <img src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" className="logo-photo" />
        <div className="button-group">
          <button className="catalog-button" onClick={() => navigate('/catalog')}>Catalog</button>
          <button className="task-button" onClick={() => navigate('/tasks')}>Tasks</button>
        </div>
      </div>
      
<div className="profile-content" style={{ paddingTop: `${dynamicPadding}rem` }}>        <div className="profile-header">
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=random&size=200`}
            alt="User Avatar"
            className="profile-avatar"
          />
          <h2>@{user.username}</h2>
        </div>

        <h3 className="section-header">Completed Goals</h3>
        
        <div className="goals-grid">
          {goals.length === 0 ? (
            <p>No goals completed yet!</p>
          ) : (
            goals.map((goal) => (
              <div key={goal._id} className="goal-card">
                <h4>Goal {goal.goal_id}</h4>
                <p>Assigned for: {goal.assigned_for}</p>
                {goal.completed && <p>✓ Completed</p>}
              </div>
            ))
          )}
        </div>

        <h3 className="section-header">My Collection</h3>
        
        <div className="card-list">
          {cards.length === 0 ? (
            <p>No cards yet. Complete goals to earn packs!</p>
          ) : (
            cards.map((card) => (
              <div key={card._id} className="card-item">
                <div className="card-image-placeholder"></div>
                <h4>Card {card.card_id}</h4>
                <p>Quantity: {card.quantity}</p>
              </div>
            ))
          )}
        </div>

        <button className="logout-button" onClick={() => {
          localStorage.removeItem("user_id");
          navigate('/login');
        }}>Logout</button>
      </div>
    </>
  );
}