import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, Student } from '../db';

export function ProfileSetup() {
  const [formData, setFormData] = useState({
    major: '',
    interests: [] as string[],
    skills: [] as string[],
    hackathonExperience: false
  });
  const navigate = useNavigate();

  const handleSubmit = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as Student;
    const updatedUser = { ...currentUser, ...formData };
    
    // Update in mock DB
    const userIndex = db.students.findIndex(s => s.id === currentUser.id);
    if (userIndex !== -1) {
      db.students[userIndex] = updatedUser;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    navigate('/clubs');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Major</label>
          <input
            type="text"
            value={formData.major}
            onChange={(e) => setFormData({...formData, major: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Computer Science"
          />
        </div>
        
        <div>
          <label className="block mb-1">Interests (Select at least one)</label>
          {['Technology', 'Business', 'Arts'].map(interest => (
            <label key={interest} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => {
                  const newInterests = formData.interests.includes(interest)
                    ? formData.interests.filter(i => i !== interest)
                    : [...formData.interests, interest];
                  setFormData({...formData, interests: newInterests});
                }}
                className="mr-2"
              />
              {interest}
            </label>
          ))}
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}