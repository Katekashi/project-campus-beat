import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedHeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Your existing hero content */}
    </motion.div>
  );
};