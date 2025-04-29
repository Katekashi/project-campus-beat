import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

interface ClubCardProps {
  id: string;
  name: string;
  description: string;
  university: string;
  member_count: number;
}

export const ClubCard = ({ 
  id, 
  name, 
  description, 
  university, 
  member_count 
}: ClubCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    className="bg-white rounded-xl shadow-sm"
  >
    <Link to={`/clubs/${id}`} className="block p-6">
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-gray-600 mt-1">{university}</p>
      <p className="text-gray-700 mt-2 line-clamp-2">{description}</p>
      <div className="mt-4 flex items-center text-gray-600">
        <Users className="h-5 w-5 mr-2" />
        <span>{member_count} members</span>
      </div>
    </Link>
  </motion.div>
);