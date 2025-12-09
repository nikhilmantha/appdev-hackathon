import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../index.css";

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
  status: string;
  assigned_for: string;
  completed_at?: string | null;
}

interface GoalTemplate {
  _id: string;
  name: string;
  description: string;
  reward_packs: number;
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
  const [goalDetails, setGoalDetails] = useState<{ [key: string]: GoalTemplate }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:8000/profile/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(async (data) => {
        console.log("Profile data:", data);
        setUser(data.user);
        setCards(data.user_cards || []);
        
        // Filter only completed goals
        const completedGoals = (data.user_goals || []).filter(
          (g: Goal) => g.status === "completed"
        );
        setGoals(completedGoals);
        
        // Fetch goal template details for each completed goal
        const details: { [key: string]: GoalTemplate } = {};
        for (const goal of completedGoals) {
          try {
            const response = await fetch(`http://localhost:8000/goals/${goal.goal_id}`);
            if (response.ok) {
              const goalData = await response.json();
              details[goal.goal_id] = goalData;
            }
          } catch (err) {
            console.error("Failed to fetch goal details:", err);
          }
        }
        setGoalDetails(details);
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>No user data found.</p>;
  }

  const cardsPerRow = 3;
  const goalsPerRow = 3;
  const cardRows = Math.ceil(cards.length / cardsPerRow);
  const goalRows = Math.ceil(goals.length / goalsPerRow);
  const basePadding = 40;
  const paddingPerGoalRow = 8; 
  const paddingPerCardRow = 18; 
  const dynamicPadding = basePadding + (goalRows * paddingPerGoalRow) + (cardRows * paddingPerCardRow);

  return (
    <>
      <div className="top-bar">
        <img 
          src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" 
          alt="app dev logo" 
          className="logo-photo" 
        />
        <div className="button-group">
          <button className="catalog-button" onClick={() => navigate('/catalog')}>
            Catalog
          </button>
          <button className="task-button" onClick={() => navigate('/tasks')}>
            Tasks
          </button>
        </div>
      </div>

      <div className="profile-content" style={{ paddingTop: `${dynamicPadding}rem` }}>
        <div className="profile-header">
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=random&size=200`}
            alt="User Avatar"
            className="profile-avatar"
          />
          <h2>@{user.username}</h2>
          <p>Packs Available: {user.packs_available}</p>
          <p>Completed Goals: {user.completed_goals}</p>
        </div>

        <h3 className="section-header">Completed Goals</h3>
        <div className="goals-grid">
          {goals.length === 0 ? (
            <p>No goals completed yet!</p>
          ) : (
            goals.map((goal) => {
              const detail = goalDetails[goal.goal_id];
              return (
                <div key={goal._id} className="goal-card">
                  <h4>{detail ? detail.name : 'Loading...'}</h4>
                  {detail && detail.description && (
                    <p className="goal-description">{detail.description}</p>
                  )}
                  <p>Assigned for: {goal.assigned_for}</p>
                  <p>✓ Completed</p>
                </div>
              );
            })
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

        <button 
          className="logout-button" 
          onClick={() => {
            localStorage.removeItem("user_id");
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}