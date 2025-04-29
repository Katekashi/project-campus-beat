import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { User, School, Code, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Add this import

interface Profile {
  id: string;
  full_name: string;
  university: string;
  degree_level: string;
  major: string;
  skills: string[];
  interests: string[];
  hackathon_experience: boolean;
}

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false); // Add this state
  const [formData, setFormData] = useState({
    full_name: '',
    university: '',
    degree_level: '',
    major: '',
    skills: [] as string[],
    interests: [] as string[],
    hackathon_experience: false
  });

  const initialFormData = { // Add this constant
    full_name: '',
    university: '',
    degree_level: '',
    major: '',
    skills: [] as string[],
    interests: [] as string[],
    hackathon_experience: false
  };

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          university: profileData.university || '',
          degree_level: profileData.degree_level || '',
          major: profileData.major || '',
          skills: profileData.skills || [],
          interests: profileData.interests || [],
          hackathon_experience: profileData.hackathon_experience || false
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile.', {
        duration: 4000,
        style: { background: '#dc2626', color: '#fff', fontWeight: 'bold' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not found.', { duration: 4000 });
      return;
    }
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!', {
        duration: 4000,
        style: { background: '#4f46e5', color: '#fff', fontWeight: 'bold' },
        iconTheme: { primary: '#ffffff', secondary: '#4f46e5' }
      });

      setProfile({ id: user.id, ...formData });
      setEditing(false);
      await fetchProfileData();
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.', {
        duration: 4000,
        style: { background: '#dc2626', color: '#fff', fontWeight: 'bold' }
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill('');
    }
  };

  const handleAddInterest = () => {
    if (newInterest && !formData.interests.includes(newInterest)) {
      setFormData(prev => ({ ...prev, interests: [...prev.interests, newInterest] }));
      setNewInterest('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interest) }));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.full_name || 'Update your profile'}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => {
                if (profile) {
                  setFormData({
                    full_name: profile.full_name || '',
                    university: profile.university || '',
                    degree_level: profile.degree_level || '',
                    major: profile.major || '',
                    skills: profile.skills || [],
                    interests: profile.interests || [],
                    hackathon_experience: profile.hackathon_experience || false
                  });
                }
                setEditing(true);
              }}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Edit Mode */}
        {editing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Form fields here (same as before, no change) */}

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to discard your changes?')) {
                    setEditing(false);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 text-sm font-medium rounded-md text-white ${saving ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          // Profile Display (same as before)
          <div> {/* Existing profile fields display here */} </div>
        )}
      </div>
    </div>
  );
};