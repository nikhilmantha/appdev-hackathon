import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Quests', path: '/tasks' },
    { name: 'Cards', path: '/catalog' },
    { name: 'Profile', path: '/profile' },
  ];

  const getActiveIndex = () => {
    const index = navItems.findIndex(item => {
      if (item.path === '/') {
        return location.pathname === '/';
      }
      return location.pathname.startsWith(item.path);
    });
    return index === -1 ? 0 : index;
  };

  const activeIndex = getActiveIndex();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, type: 'spring' }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-gray-700/10 border border-white/10 backdrop-blur-md shadow-2xl">
        {/* Logo */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 hover:opacity-80 transition-opacity"
        >
          <img
            className="h-11 transition-all duration-200" 
            src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" 
            alt="TerpQuest logo" 
          />
          <span className="text-3xl font-extrabold text-white">TerpQuest</span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-2" />

        {/* Navigation Items with Slider */}
        <div className="relative flex items-center gap-1 bg-gray-800/50 rounded-full p-1">
          {/* Animated Background Slider */}
          <motion.div
            className="absolute h-[calc(100%-8px)] rounded-full bg-linear-to-r from-blue-600 to-blue-500 shadow-lg"
            initial={false}
            animate={{
              left: `${activeIndex * 33.333}%`,
              width: '33.333%',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            style={{ top: '4px' }}
          />

          {/* Navigation Buttons */}
          {navItems.map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative z-10 px-6 py-2 rounded-full text-md font-semibold transition-colors duration-200 ${
                activeIndex === index
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}