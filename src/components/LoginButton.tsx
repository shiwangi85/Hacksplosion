import React from 'react';
import { LogIn } from 'lucide-react';

export default function LoginButton() {
  return (
    <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-indigo-500/20">
      <LogIn className="w-4 h-4" />
      <span className="font-medium">Login</span>
    </button>
  );
}