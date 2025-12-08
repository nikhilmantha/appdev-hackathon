import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import "./Tasks.css";

interface Goal {
  _id: string;
  user_id: string;
  goal_id: string;
  status: string;
  reward_packs: number;
  assigned_for: string;
  created_at: string;
  completed_at: string | null;
}

interface GoalTemplate {
  _id: string;
  name: string;
  description: string;
  reward_packs: number;
}

export default function Tasks() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalDetails, setGoalDetails] = useState<{ [key: string]: GoalTemplate }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());
  const fetchingRef = useRef(false); // Add ref to prevent duplicate fetches

useEffect(() => {
  // Prevent duplicate fetches
  if (fetchingRef.current) return;
  fetchingRef.current = true;

  setGoals([]);  // reset so you don't accumulate

  const userId = localStorage.getItem("user_id");
  if (!userId) {
    navigate('/login');
    fetchingRef.current = false;
    return;
  }

  // Fetch or create today's goals
  fetch(`http://localhost:8000/tasks/${userId}`, {
    method: 'POST',
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    })
    .then(async (data) => {
      setGoals(data);
      
      // Fetch details for each goal
      const details: { [key: string]: GoalTemplate } = {};
      for (const goal of data) {
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
      
      // Track which goals are already completed
      const completedIds: string[] = data
        .filter((g: Goal) => g.status === "completed")
        .map((g: Goal) => g._id);
      setCompletedGoals(new Set<string>(completedIds));
      
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch tasks:", err);
      setError(err.message);
      setLoading(false);
    })
    .finally(() => {
      fetchingRef.current = false; // Reset when done
    });
}, [navigate]);

const handleCheckboxChange = async (goalId: string) => {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  // Don't allow unchecking completed goals
  if (completedGoals.has(goalId)) return;

  // Optimistically update UI
  const newCompletedGoals = new Set(completedGoals);
  newCompletedGoals.add(goalId);
  setCompletedGoals(newCompletedGoals);

  try {
    const response = await fetch(
      `http://localhost:8000/tasks/${userId}/goal/${goalId}/complete`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error("Failed to complete goal");
    }

    const data = await response.json();
    console.log(data.message);

    // Check if all goals are completed using the updated set
    if (newCompletedGoals.size === goals.length) {
      alert("Congratulations! You've completed all your goals and earned packs!");
    }
  } catch (err) {
    console.error("Error completing goal:", err);
    // Revert optimistic update on error
    setCompletedGoals(completedGoals);
    alert("Failed to complete goal. Please try again.");
  }
};

  if (loading) {
    return <div className="tasks-page"><p>Loading tasks...</p></div>;
  }

  if (error) {
    return <div className="tasks-page"><p>Error: {error}</p></div>;
  }

  return (
    <div className="tasks-page">
      {/* Top Bar */}
      <div className="top-bar">
        <img 
          src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" 
          alt="app dev logo" 
          className="logo-photo" 
        />
        <div className="button-group">
          <button className="profile-button" onClick={() => navigate('/profile')}>
            Profile
          </button>
          <button className="catalog-button1" onClick={() => navigate('/catalog')}>
            Catalog
          </button>
        </div> 
      </div>    

      {/* Label at the top that says Tasks */}
      <div className="tasks-box">Tasks</div>

      {/* Tasks section where title, goal header, and goals are */}
      <div className="tasks-section">
        <h1 className="tasks-title">Welcome User, Here are your goals for the day</h1>
        <div className="goals-container">
          <h2 className="goals-heading">
            Complete All Your Goals and You'll Get a New Card!
          </h2>
          
          {goals.length === 0 ? (
            <p>No goals available today.</p>
          ) : (
            goals.map((goal, index) => {
              const detail = goalDetails[goal.goal_id];
              const isCompleted = completedGoals.has(goal._id);
              
              return (
                <div key={goal._id} className="goal-box">
                  <input
                    type="checkbox"
                    id={`goal${index + 1}`}
                    className="goal-checkbox"
                    checked={isCompleted}
                    onChange={() => handleCheckboxChange(goal._id)}
                    disabled={isCompleted}
                  />
                  <label htmlFor={`goal${index + 1}`} className="goal-label">
                    {detail ? detail.name : `Goal ${index + 1}`}
                    {detail && detail.description && (
                      <span className="goal-description"> - {detail.description}</span>
                    )}
                  </label>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}