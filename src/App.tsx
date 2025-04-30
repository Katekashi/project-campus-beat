// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntroPage } from './pages/IntroPage'; // Add file extension
import { AuthPage } from './pages/AuthPage';
import { ProfileSetup } from './pages/ProfileSetup';
import { ClubList } from './pages/ClubList';

export default function App() {
  return (
    <div className="text-3xl font-bold underline text-red-700">
      TEST - Tailwind is working!
    </div>
  )
}