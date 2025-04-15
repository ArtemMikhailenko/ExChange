// src/app/login/components/BackgroundDecoration.tsx
import React from 'react';

interface BackgroundDecorationProps {
  isDark: boolean;
}

const BackgroundDecoration: React.FC<BackgroundDecorationProps> = ({ isDark }) => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-white to-yellow-50'
      }`}></div>
      
      <div className={`absolute -top-20 -right-20 w-96 h-96 rounded-full ${
        isDark ? 'bg-yellow-500/5' : 'bg-yellow-500/10'
      }`}></div>
      <div className={`absolute -bottom-40 -left-20 w-80 h-80 rounded-full ${
        isDark ? 'bg-yellow-600/5' : 'bg-yellow-400/10'
      }`}></div>
      
      <div className={`absolute inset-0 opacity-[0.03] ${isDark ? 'invert-0' : 'invert'}`} 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '20px 20px'
        }}>
      </div>
    </div>
  );
};

export default BackgroundDecoration;