import "../index.css";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowCard from "../components/GlowCard";

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
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalDetails, setGoalDetails] = useState<{ [key: string]: GoalTemplate }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [totalCardsCollected, setTotalCardsCollected] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate('/signin');
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
        
        // Calculate total cards collected
        const totalCards = (data.user_cards || []).reduce((sum: number, card: any) => sum + card.quantity, 0);
        setTotalCardsCollected(totalCards);
        
        const completedGoals = (data.user_goals || []).filter(
          (g: Goal) => g.status === "completed"
        );
        setGoals(completedGoals);
        
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

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xl font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/signin')}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p className="text-xl">No user data found.</p>
      </div>
    );
  }

  // Calculate current streak (dummy stat for now - you can implement actual logic later)
  const currentStreak = Math.min(user.completed_goals, 7);
  
  // Calculate total packs opened (completed goals = packs earned and potentially opened)
  const totalPacksOpened = Math.max(0, user.completed_goals - user.packs_available);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white overflow-y-auto">
      {/* Profile Content */}
      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
            <motion.img
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={`https://ui-avatars.com/api/?name=${user.username}&background=random&size=200`}
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-500/50 shadow-lg shadow-blue-500/30"
            />
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                @{user.username}
              </h2>
              <p className="text-gray-400 mb-6">{user.email}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <p className="text-sm text-gray-300">Packs Available</p>
                  <p className="text-2xl font-bold text-blue-400">{user.packs_available}</p>
                </div>
                <div className="px-6 py-3 rounded-xl bg-green-500/20 border border-green-500/30">
                  <p className="text-sm text-gray-300">Completed Goals</p>
                  <p className="text-2xl font-bold text-green-400">{user.completed_goals}</p>
                </div>
                <div className="px-6 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  <p className="text-sm text-gray-300">Cards Collected</p>
                  <p className="text-2xl font-bold text-purple-400">{totalCardsCollected}</p>
                </div>
                <div className="px-6 py-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
                  <p className="text-sm text-gray-300">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-400">{currentStreak} 🔥</p>
                </div>
                <div className="px-6 py-3 rounded-xl bg-pink-500/20 border border-pink-500/30">
                  <p className="text-sm text-gray-300">Packs Opened</p>
                  <p className="text-2xl font-bold text-pink-400">{totalPacksOpened}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Completed Goals Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-4xl font-extrabold mb-8 flex items-center gap-3">
            <span className="text-green-400">✓</span> Completed Goals
          </h3>
          
          {goals.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-2xl bg-gray-800/40 border border-gray-700/50">
              <p className="text-xl text-gray-400">No goals completed yet! Start your journey today.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal, index) => {
                const detail = goalDetails[goal.goal_id];
                return (
                  <GlowCard key={goal._id} delay={index * 0.1}>
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-white">
                        {detail ? detail.name : 'Loading...'}
                      </h4>
                      <span className="text-2xl">✅</span>
                    </div>
                    {detail && detail.description && (
                      <p className="text-gray-300 mb-4 text-sm">{detail.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Assigned: {goal.assigned_for}</span>
                      {detail && (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-semibold">
                          +{detail.reward_packs} 🎁
                        </span>
                      )}
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-12 py-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-lg hover:bg-red-500/30 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-500/20"
          >
            Logout
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}