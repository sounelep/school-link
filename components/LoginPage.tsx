
import React, { useState } from 'react';
import { GoogleIcon } from './icons';

interface LoginPageProps {
  onLogin: (userId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded admin credentials as requested
    if (email === 'admin' && password === 'admin') {
      onLogin('user-1'); // ID of Alice Dubois (Global Admin)
    } else {
      setError('Identifiants incorrects. Essayez "admin" / "admin"');
    }
  };

  const handleGoogleLogin = () => {
    // Simulation of Google Login
    // In a real app, this would call Firebase/OAuth
    onLogin('user-1'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">School Link</h1>
          <p className="text-gray-500 mt-2">Connectez-vous pour continuer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email ou Identifiant</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 border"
              placeholder="ex: admin"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-3 border"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-md transition duration-300 shadow-md"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-6 w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 shadow-sm bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
          >
            <GoogleIcon className="h-5 w-5 mr-2 text-red-500" />
            <span>Google</span>
          </button>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          Pour la démo, utilisez: <strong>admin / admin</strong>
        </div>
      </div>
    </div>
  );
};
