import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';

export function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.students.find(s => s.email === email && s.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/profile-setup');
    } else {
      alert('Invalid credentials. Try: student0@utdallas.edu / password123');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="student0@utdallas.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        
        <input
          type="password"
          placeholder="password123"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>
      
      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500"
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
      </button>
    </div>
  );
}