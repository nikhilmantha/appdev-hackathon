import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface User {
  _id: string;
  username: string;
  email: string;
  packs_available: number;
}

interface OpenedCard {
  card_id: string;
  name: string;
  rarity: string;
}

// Dynamically import all card images
const imageFiles = import.meta.glob("../assets/cards/*.png", { eager: true });
const cardImages: Record<string, string> = Object.keys(imageFiles)
  .map((path) => {
    const key = path.split("/").pop()!.replace(".png", "");
    return { [key]: (imageFiles[path] as any).default };
  })
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

export default function Tasks() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalDetails, setGoalDetails] = useState<{ [key: string]: GoalTemplate }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState("User");
  const [user, setUser] = useState<User | null>(null);
  const [openingPack, setOpeningPack] = useState(false);
  const [showPackAnimation, setShowPackAnimation] = useState(false);
  const [timeUntilMidnight, setTimeUntilMidnight] = useState("");
  const [allQuestsCompleted, setAllQuestsCompleted] = useState(false);
  const [openedCards, setOpenedCards] = useState<OpenedCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const fetchingRef = useRef(false);

  // Countdown timer to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilMidnight(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetch(`http://localhost:8000/profile/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserName(data.user.username || "User");
          setUser(data.user);
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, []);

  useEffect(() => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    setGoals([]);

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate('/login');
      fetchingRef.current = false;
      return;
    }

    fetch(`http://localhost:8000/tasks/${userId}`, {
      method: 'POST',
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then(async (data) => {
        setGoals(data);
        
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
        
        const completedIds: string[] = data
          .filter((g: Goal) => g.status === "completed")
          .map((g: Goal) => g._id);
        setCompletedGoals(new Set<string>(completedIds));
        
        // Check if all quests are completed
        setAllQuestsCompleted(data.length > 0 && completedIds.length === data.length);
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        setError(err.message);
        setLoading(false);
      })
      .finally(() => {
        fetchingRef.current = false;
      });
  }, [navigate]);

  const handleCheckboxChange = async (goalId: string) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    if (completedGoals.has(goalId)) return;

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
      
      // Update user packs count
      if (user) {
        setUser({ ...user, packs_available: user.packs_available + 1 });
      }

      // Check if all quests are now completed
      if (newCompletedGoals.size === goals.length) {
        setAllQuestsCompleted(true);
        // Award bonus pack for completing all quests
        if (user) {
          setUser({ ...user, packs_available: user.packs_available + 2 }); // +1 from quest, +1 bonus
        }
      }
    } catch (err) {
      console.error("Error completing goal:", err);
      setCompletedGoals(completedGoals);
      alert("Failed to complete goal. Please try again.");
    }
  };

  const handleOpenPack = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId || !user) return;

    setOpeningPack(true);
    setShowPackAnimation(true);
    
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}/packs/open`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to open pack");
      }

      // Get the opened cards from API response
      const cardsData = await response.json();
      console.log("Opened cards:", cardsData);
      
      // Fetch card details for each opened card
      const cardDetailsPromises = cardsData.cards.map(async (card: any) => {
        try {
          const cardResponse = await fetch(`http://localhost:8000/card/${card.card_id}`);
          if (cardResponse.ok) {
            return await cardResponse.json();
          }
        } catch (err) {
          console.error("Failed to fetch card details:", err);
        }
        return null;
      });
      
      const details = await Promise.all(cardDetailsPromises);
      const validCards = details.filter(card => card !== null) as OpenedCard[];
      setOpenedCards(validCards);
      setCurrentCardIndex(0);
      
    } catch (err: any) {
      console.error("Error opening pack:", err);
      alert(err.message || "Failed to open pack");
      setShowPackAnimation(false);
      setOpeningPack(false);
    }
  };

  const handleClosePack = () => {
    setShowPackAnimation(false);
    setOpeningPack(false);
    setOpenedCards([]);
    setCurrentCardIndex(0);
    // Reload to update pack count and card collection
    window.location.reload();
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStart - clientX;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentCardIndex < openedCards.length - 1) {
        // Swipe left - next card
        setCurrentCardIndex(currentCardIndex + 1);
      } else if (diff < 0 && currentCardIndex > 0) {
        // Swipe right - previous card
        setCurrentCardIndex(currentCardIndex - 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xl font-semibold">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <h1 className="text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome back, {userName}!
        </h1>
        <p className="text-xl text-gray-400">Ready to conquer today's quests?</p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Quests Section - Left Side (2 columns) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">

                <h2 className="text-4xl font-extrabold">Daily Quests</h2>
              </div>
              
              {/* Countdown Timer */}
              <div className="px-6 py-3 rounded-xl bg-gray-800/60 border border-gray-700/50">
                <p className="text-2xl font-mono font-bold text-blue-400">{timeUntilMidnight}</p>
              </div>
            </div>

            {goals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No quests available today. Check back tomorrow!</p>
              </div>
            ) : allQuestsCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 px-6"
              >
                <div className="mb-6">
                  <span className="text-8xl">🎉</span>
                </div>
                <h3 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  All Tasks Completed!
                </h3>
                <p className="text-xl text-gray-300 mb-2">Great job on finishing your daily quests!</p>
                <p className="text-lg text-gray-400">Check back tomorrow for new challenges.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal, index) => {
                  const detail = goalDetails[goal.goal_id];
                  const isCompleted = completedGoals.has(goal._id);
                  
                  return (
                    <motion.div
                      key={goal._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-gray-800/40 border-gray-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Custom Checkbox */}
                        <button
                          onClick={() => handleCheckboxChange(goal._id)}
                          disabled={isCompleted}
                          className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                            isCompleted
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/10'
                          } ${isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {isCompleted && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </motion.svg>
                          )}
                        </button>

                        {/* Quest Content */}
                        <div className="flex-1">
                          <h3
                            className={`text-xl font-bold mb-1 transition-all duration-300 ${
                              isCompleted
                                ? 'line-through text-gray-500'
                                : 'text-white'
                            }`}
                          >
                            {detail ? detail.name : `Quest ${index + 1}`}
                          </h3>
                          {detail && detail.description && (
                            <p
                              className={`text-sm transition-all duration-300 ${
                                isCompleted ? 'line-through text-gray-600' : 'text-gray-400'
                              }`}
                            >
                              {detail.description}
                            </p>
                          )}
                        </div>

                        {/* Reward Badge */}
                        <div className="flex-shrink-0">
                          <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
                            isCompleted
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {isCompleted ? '✓ Complete' : '+1 🎁'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Progress Bar with Bonus Pack Indicator - Only show if not all completed */}
            {!allQuestsCompleted && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-400">Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-400">
                      {completedGoals.size} / {goals.length}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold">
                      +1 🎁
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${goals.length > 0 ? (completedGoals.size / goals.length) * 100 : 0}%` 
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pack Opening Section - Right Side (1 column) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24 p-8 rounded-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
            <div className="text-center">
              <h3 className="text-3xl font-extrabold mb-4">Card Packs</h3>
              
              <div className="mb-6 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-gray-400 mb-2">Available Packs</p>
                <p className="text-6xl font-extrabold text-blue-400">
                  {user?.packs_available || 0}
                </p>
              </div>

              {user && user.packs_available > 0 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenPack}
                  disabled={openingPack}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {openingPack ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Opening...
                    </span>
                  ) : (
                    'Open Pack'
                  )}
                </motion.button>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-2">No packs available</p>
                  <p className="text-sm text-gray-500">Complete quests to earn more!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pack Opening Animation Overlay */}
      <AnimatePresence>
        {showPackAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            {openedCards.length > 0 ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Card Carousel */}
                <div className="relative w-full max-w-md h-[600px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCardIndex}
                      initial={{ opacity: 0, x: 100, rotateY: -90 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: -100, rotateY: 90 }}
                      transition={{ duration: 0.5, type: "spring" }}
                      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                      onMouseDown={handleDragStart}
                      onMouseUp={handleDragEnd}
                      onTouchStart={handleDragStart}
                      onTouchEnd={handleDragEnd}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, info) => {
                        if (info.offset.x < -50 && currentCardIndex < openedCards.length - 1) {
                          setCurrentCardIndex(currentCardIndex + 1);
                        } else if (info.offset.x > 50 && currentCardIndex > 0) {
                          setCurrentCardIndex(currentCardIndex - 1);
                        }
                      }}
                    >
                      <div className="w-full h-full p-8 flex items-center justify-center">
                        {cardImages[openedCards[currentCardIndex].name] && (
                          <img
                            src={cardImages[openedCards[currentCardIndex].name]}
                            alt={openedCards[currentCardIndex].name}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl pointer-events-none"
                            draggable={false}
                          />
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Carousel Indicators */}
                <div className="flex gap-2 mt-8">
                  {openedCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCardIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentCardIndex
                          ? 'bg-blue-500 w-8'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Card Counter */}
                <p className="mt-4 text-gray-400 text-lg">
                  {currentCardIndex + 1} / {openedCards.length}
                </p>

                {/* Navigation Arrows */}
                {currentCardIndex > 0 && (
                  <button
                    onClick={() => setCurrentCardIndex(currentCardIndex - 1)}
                    className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {currentCardIndex < openedCards.length - 1 && (
                  <button
                    onClick={() => setCurrentCardIndex(currentCardIndex + 1)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* Done Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClosePack}
                  className="mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Done
                </motion.button>
              </div>
            ) : (
              // Loading state while fetching card details
              <motion.div
                initial={{ scale: 0.5, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-9xl mb-4"
                >
                </motion.div>
                <h2 className="text-4xl font-extrabold text-white">Opening Pack...</h2>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}