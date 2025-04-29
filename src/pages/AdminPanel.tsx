// Create new file AdminPanel.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export function AdminPanel() {
  const [eventTitle, setEventTitle] = useState('');
  const [clubId] = useState('your-club-id'); // Replace with dynamic club ID or prop
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.from('events').insert({
        club_id: clubId,
        title: eventTitle,
        start_time: new Date(),
        end_time: new Date(Date.now() + 2 * 60 * 60 * 1000) // +2 hours
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      setEventTitle(''); // Reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Create New Event</h2>
      
      <form onSubmit={handleCreateEvent} className="space-y-4">
        <div>
          <label htmlFor="eventTitle" className="block text-sm font-medium mb-1">
            Event Title
          </label>
          <input
            id="eventTitle"
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm">
            Event created successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-white ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}