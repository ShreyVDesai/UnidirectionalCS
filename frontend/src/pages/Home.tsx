// src/pages/Home.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardA from './DashboardA';
import DashboardB from './DashboardB';

const Home: React.FC = () => {
  const { type } = useAuth();

  if (type === 'A') return <DashboardA />;
  if (type === 'B') return <DashboardB />;

  return <div>Select a dashboard</div>;
};

export default Home;
