import { db } from '../db';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Search, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Club {
  id: string;
  name: string;
  description: string;
  university: string;
  tags: string[];
  member_count: number;
  match_score?: number;
}

export const ClubList: React.FC = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const matchedClubs = db.clubs.map(club => ({
        ...club,
        match_score: calculateMatchScore(club, currentUser)
      }));
      setClubs(matchedClubs);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };
  
  const calculateMatchScore = (club: Club, user: any) => {
    if (!user?.interests) return 0;
    return club.tags.filter(tag => user.interests.includes(tag)).length * 30;
  };

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clubs</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
              className="bg-white rounded-xl shadow-sm p-6 h-64 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <Link to={`/clubs/${club.id}`} className="block p-6 h-full">
                {club.match_score && club.match_score > 30 && (
                  <div className="absolute top-4 right-4 flex items-center text-yellow-600">
                    <Sparkles className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Recommended</span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{club.university}</p>
                <p className="text-gray-700 line-clamp-2 mb-4">{club.description}</p>
                <div className="mt-auto flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{club.member_count} members</span>
                </div>
              </Link>
            </motion.div>
          ))}

          {filteredClubs.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-600">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>No clubs found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};