import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, MapPin, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Club {
  id: string;
  name: string;
  description: string;
  university: string;
  member_count: number;
  is_member: boolean;
  is_admin: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
}

export const ClubDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      // Fetch club details
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select(`
          *,
          member_count: club_members(count),
          is_member: club_members!inner(user_id)
        `)
        .eq('id', id)
        .single();

      if (clubError) throw clubError;

      // Check if user is admin
      const { data: adminData } = await supabase
        .from('club_members')
        .select('role')
        .eq('club_id', id)
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .single();

      setClub({
        ...clubData,
        is_admin: !!adminData,
        is_member: true
      });

      // Fetch upcoming events
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('club_id', id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (eventError) throw eventError;
      setEvents(eventData || []);
    } catch (error) {
      console.error('Error fetching club details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async () => {
    if (!user) return;
    setJoining(true);
    try {
      const { error } = await supabase
        .from('club_members')
        .insert({
          club_id: id,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;
      await fetchClubDetails();
    } catch (error) {
      console.error('Error joining club:', error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Club not found</h2>
        <p className="mt-2 text-gray-600">The club you're looking for doesn't exist.</p>
        <Link to="/clubs" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
          Browse all clubs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{club.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{club.university}</p>
          </div>
          {!club.is_member && (
            <button
              onClick={handleJoinClub}
              disabled={joining}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {joining ? 'Joining...' : 'Join Club'}
            </button>
          )}
          {club.is_admin && (
            <Link
              to={`/clubs/${id}/events/new`}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Link>
          )}
        </div>

        <p className="text-gray-700 mb-6">{club.description}</p>

        <div className="flex items-center text-gray-600">
          <Users className="h-5 w-5 mr-2" />
          <span>{club.member_count} members</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
          Upcoming Events
        </h2>

        <div className="space-y-6">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 mt-2">{event.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {format(new Date(event.start_time), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {events.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>No upcoming events</p>
              {club.is_admin && (
                <Link
                  to={`/clubs/${id}/events/new`}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create an event
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};