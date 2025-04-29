import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Calendar, BookOpen } from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90" />
        <img
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=3540"
          alt="University campus"
          className="w-full h-[500px] object-cover rounded-xl"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Discover Your College Community
            </h1>
            <p className="text-xl text-white">
              Join clubs, attend events, and connect with fellow students who share your interests.
            </p>
            {!user && (
              <Link
                to="/auth"
                className="inline-block px-6 py-3 text-lg font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { 
            icon: Users, 
            title: "Join Clubs", 
            desc: "Find clubs matching your interests" 
          },
          { 
            icon: Calendar, 
            title: "Attend Events", 
            desc: "Workshops and social gatherings" 
          },
          { 
            icon: BookOpen, 
            title: "Learn & Grow", 
            desc: "Develop new skills" 
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow hover:scale-[1.02] cursor-pointer"
            onClick={() => navigate('/clubs')}
          >
            <item.icon className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};