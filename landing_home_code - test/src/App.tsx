import React, { Suspense, lazy } from 'react';
import CursorTrail from './components/CursorTrail';
import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/home/DashboardPage';
import ProfilePage from './pages/home/ProfilePage';
import SettingsPage from './pages/home/SettingsPage';
import SocialStudiesWrapper from './pages/SocialStudiesWrapper';
import './styles/globals.css';

const SciencePage = lazy(() => import('./pages/SciencePage'));

function App()
