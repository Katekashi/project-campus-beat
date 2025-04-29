import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { initializeDB, generateMockStudents } from '../db'; // Add this import

export const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Initialize mock data when component mounts
  useEffect(() => {
    initializeDB();
    generateMockStudents(20); // Generate 20 test profiles
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4"
    >
      {/* Keep your existing beautiful animations */}
      <div className="text-center space-y-6 max-w-2xl">
        {/* ... existing code ... */}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/auth')} // Changed to auth flow
          className="px-6 py-2 md:px-8 md:py-3 bg-red-600 rounded-full text-lg font-bold hover:bg-red-700 transition-all"
        >
          EXPLORE CLUBS
        </motion.button>
      </div>
    </motion.div>
  );
};