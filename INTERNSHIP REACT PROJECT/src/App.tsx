/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './pages/Home/HomeView';
import FavouritesView from './pages/Favourites/FavouritesView';
import CompareView from './pages/Compare/CompareView';
import TriviaView from './pages/Trivia/TriviaView';
import AuthView from './pages/Auth/AuthView';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

export default function App() {
  return (
    <AuthProvider>
      <div id="app" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <div>
          <Header />
          <main id="app-main">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/compare" element={<CompareView />} />
              <Route path="/trivia" element={<TriviaView />} />
              <Route
                path="/auth"
                element={
                  <GuestRoute>
                    <AuthView />
                  </GuestRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavouritesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favourites"
                element={
                  <ProtectedRoute>
                    <FavouritesView />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}




