import "../index.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import GlowCard from '../components/GlowCard';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        navigate('/tasks');
        return;
      }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        if(response.status === 422) { //Authentication Error
          throw new Error(data.detail[0].ctx.reason);
        } else if (response.status === 401) { //User not found
          throw new Error(data.detail);
        }
      }

      if (data.id) {
        localStorage.setItem('user_id', data.id);
        navigate('/profile');
      } else {
        console.error('No id in response');
        setError('Login response missing user information');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="w-dvw h-dvh bg-linear-to-b from-gray-900 to-black text-white overflow-hidden relative flex flex-col">
      {/* Nav Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="flex justify-between items-center z-10 px-8 py-4"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img 
            className="h-12 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" 
            src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" 
            alt="app dev logo" 
          />
          <h1 className="text-3xl font-extrabold">TerpQuest</h1>
        </button>
        
        <button 
          onClick={() => navigate('/register')}
          className="text-white font-semibold px-6 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5"
        >
          Register
        </button>
      </motion.div>

      {/* Login Container */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <GlowCard>
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-300">Sign in to your TerpQuest account</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-gray-600/50 text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/60 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-gray-600/50 text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/60 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Create one
                </button>
              </p>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
}