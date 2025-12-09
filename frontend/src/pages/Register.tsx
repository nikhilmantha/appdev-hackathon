import "../index.css";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import GlowCard from '../components/GlowCard';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);
      
      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setUsername("");
        setEmail("");
        setPassword("");
        setTimeout(() => navigate('/signin'), 1500);
      } else {
        if(response.status === 422) { //Authentication Error
          throw new Error(data.detail[0].ctx.reason);
        } else if (response.status === 401) { //User not found
          throw new Error(data.detail);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister();
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
          onClick={() => navigate('/signin')}
          className="text-white font-semibold px-6 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5"
        >
          Sign In
        </button>
      </motion.div>

      {/* Register Container */}
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
              <h2 className="text-4xl font-bold mb-2">Create Account</h2>
              <p className="text-gray-300">Join TerpQuest today</p>
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

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* Username Input */}
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-200 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="example1234"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-gray-600/50 text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/60 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

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

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/signin')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
}