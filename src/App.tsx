// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntroPage } from './pages/IntroPage'; // Add file extension
import { AuthPage } from './pages/AuthPage';
import { ProfileSetup } from './pages/ProfileSetup';
import { ClubList } from './pages/ClubList';

export default function App() {
  return (
    <div className="bg-red-500 p-8 text-white text-4xl">
      TEST - Tailwind is working!
    </div>
  )
}