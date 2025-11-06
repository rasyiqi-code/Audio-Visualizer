import React from 'react';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
}

const Header: React.FC<HeaderProps> = ({ theme }) => {
  return (
    <header className="p-4 z-10">
      <h1 className="text-2xl font-bold" style={{ color: theme.primary }}>
        Audio Visualizer
      </h1>
      <p className="text-sm" style={{ color: theme.secondary }}>
        Experience your sound in a new light.
      </p>
    </header>
  );
};

export default Header;
