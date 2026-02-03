import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NotificationSettings {
  channel: {
    email: boolean;
    app: boolean;
  };
  frequency: 'off' | 'daily' | 'weekly';
  events: {
    lessonReminders: boolean;
    newBadges: boolean;
    weeklySummary: boolean;
    parentSummary: boolean;
  };
  quiet: {
    start: string;
    end: string;
  };
}

interface PrivacySettings {
  visibility: 'private' | 'class' | 'public';
  twoFA: boolean;
}

interface Settings {
  theme: 'light' | 'dim' | 'hc';
  language: 'en';
  timezone: string;
  reducedMotion: boolean;
  cursorHalo: boolean;
  sfx: boolean;
  kidFlairLevel: number;
  parallax: boolean;
  dailyGoal: number;
  pace: 'gentle' | 'standard' | 'fast';
  practiceMode: 'mixed' | 'concept' | 'quiz';
  focusSubjects: string[];
  contentLevel: 'basic' | 'intermediate' | 'advanced';
  safeContent: boolean;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  saveSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'light',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  reducedMotion: false,
  cursorHalo: true,
  sfx: true,
  kidFlairLevel: 1,
  parallax: true,
  dailyGoal: 60,
  pace: 'standard',
  practiceMode: 'mixed',
  focusSubjects: ['english', 'mathematics', 'science', 'social-studies'],
  contentLevel: 'intermediate',
  safeContent: true,
  notifications: {
    channel: {
      email: true,
      app: true,
    },
    frequency: 'weekly',
    events: {
      lessonReminders: true,
      newBadges: true,
      weeklySummary: true,
      parentSummary: false,
    },
    quiet: {
      start: '20:00',
      end: '08:00',
    },
  },
  privacy: {
    visibility: 'private',
    twoFA: false,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('coteachers.settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.warn('Failed to parse saved settings, using defaults');
      }
    }

    // Check system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const saveSettings = () => {
    localStorage.setItem('coteachers.settings', JSON.stringify(settings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('coteachers.settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};