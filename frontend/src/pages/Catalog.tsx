import "../index.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import all card images
const imageFiles = import.meta.glob("../assets/cards/*.png", { eager: true });

// Use .map + .reduce to create a record of cardName -> src
const cardImages: Record<string, string> = Object.keys(imageFiles)
  .map((path) => {
    const key = path.split("/").pop()!.replace(".png", "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { [key]: (imageFiles[path] as any).default };
  })
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

interface UserCard {
  _id: string;
  user_id: string;
  card_id: string;
  quantity: number;
}

interface CardDetails {
  _id: string;
  name: string;
  rarity: string;
}

const getRarityColor = (rarity: string) => {
  switch (rarity?.toLowerCase()) {
    case 'legendary': return 'from-yellow-500 to-orange-500';
    case 'epic': return 'from-purple-500 to-pink-500';
    case 'rare': return 'from-blue-500 to-cyan-500';
    case 'common': return 'from-gray-400 to-gray-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

export default function Catalog() {
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [cardDetails, setCardDetails] = useState<{ [key: string]: CardDetails }>({});
  const [loading, setLoading] = useState(true);
  const [focusedCard, setFocusedCard] = useState<{ detail: CardDetails; quantity: number } | null>(null);

  useEffect(() => {
    const fetchUserCards = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/profile/${userId}`);
        const data = await response.json();
        const cards = data.user_cards || [];
        setUserCards(cards);

        // Fetch details for each card
        const details: { [key: string]: CardDetails } = {};
        for (const card of cards) {
          try {
            const cardResponse = await fetch(`http://localhost:8000/card/${card.card_id}`);
            if (cardResponse.ok) {
              const cardData = await cardResponse.json();
              details[card.card_id] = cardData;
            }
          } catch (err) {
            console.error("Failed to fetch card details:", err);
          }
        }
        setCardDetails(details);
      } catch (err) {
        console.error("Error fetching user cards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCards();
  }, []);

  const handleCardClick = (cardId: string, quantity: number) => {
    const detail = cardDetails[cardId];
    if (detail) {
      setFocusedCard({ detail, quantity });
    }
  };

  const handleCloseFocus = () => {
    setFocusedCard(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xl font-semibold">Loading your cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <h1 className="text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          My Cards
        </h1>
      </motion.div>

      {/* Cards Grid */}
      {userCards.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-2xl bg-gray-800/40 border border-gray-700/50">
          <p className="text-xl text-gray-400">No cards yet. Complete quests to earn packs!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {userCards.map((card, index) => {
            const detail = cardDetails[card.card_id];
            return (
              <motion.div
                key={card._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handleCardClick(card.card_id, card.quantity)}
                className="relative group cursor-pointer"
              >
                {/* Square Card Container */}
                <div className="relative aspect-square rounded-2xl bg-gray-800/60 border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                  {/* Rarity Gradient Border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(detail?.rarity)} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Card Image */}
                  <div className="relative w-full h-full p-3">
                    {detail?.name && cardImages[detail.name] && (
                      <img 
                        src={cardImages[detail.name]} 
                        alt={detail.name} 
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  
                  {/* Quantity Badge */}
                  {card.quantity > 1 && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
                      {card.quantity}
                    </div>
                  )}
                </div>

                {/* Card Name Below */}
                <div className="mt-2 text-center">
                  <p className="font-bold text-white text-sm truncate">
                    {detail ? detail.name : 'Loading...'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Focused Card Modal */}
      <AnimatePresence>
        {focusedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseFocus}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          >
            <div className="relative flex flex-col items-center">
              {/* Focused Card */}
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.5, rotate: 10 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-96 h-96 rounded-3xl bg-gray-800/90 border-4 border-gray-700/80 overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Rarity Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(focusedCard.detail.rarity)} opacity-30`} />
                
                {/* Card Image */}
                <div className="relative w-full h-full p-6 flex items-center justify-center">
                  {cardImages[focusedCard.detail.name] && (
                    <img 
                      src={cardImages[focusedCard.detail.name]} 
                      alt={focusedCard.detail.name} 
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    />
                  )}
                </div>

                {/* Quantity Badge */}
                {focusedCard.quantity > 1 && (
                  <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg">
                    {focusedCard.quantity}
                  </div>
                )}
              </motion.div>

              {/* Card Info Below */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center"
              >
                <h2 className="text-4xl font-extrabold text-white mb-2">
                  {focusedCard.detail.name}
                </h2>
                <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${getRarityColor(focusedCard.detail.rarity)} text-white font-bold text-lg shadow-lg`}>
                  {focusedCard.detail.rarity}
                </div>
              </motion.div>

              {/* Click to Exit Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-gray-400 text-sm"
              >
                click anywhere to exit
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}