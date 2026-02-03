import React, { useState } from 'react';
import { ArrowLeft, Save, RotateCcw, Monitor, Moon, Eye, Globe, Clock, Mail, Bell, Shield, Download, Smartphone, Trash2, Settings as SettingsIcon, Palette, Volume2, Zap, Users, Lock, Key, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from './contexts/SettingsContext';
import { Card } from './components/Card';
import { StickerIcon } from './components/StickerIcon';
import { GoalRing } from './components/GoalRing';
import { Toast } from './components/Toast';
import { useReducedMotionSetting } from './lib/useReducedMotionSetting';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, saveSettings, resetSettings } = useSettings();
  const reducedMotion = useReducedMotionSetting();
  const [activeTab, setActiveTab] = useState('general');
  const [showToast, setShowToast] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor, color: '#27AE60' },
    { id: 'learning', label: 'Learning', icon: Globe, color: '#22C1C3' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: '#F59E0B' },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield, color: '#FF6B6B' },
  ];

  const subjects = [
    { id: 'english', name: 'English', color: '#22C1C3' },
    { id: 'mathematics', name: 'Mathematics', color: '#FF6B6B' },
    { id: 'science', name: 'Science', color: '#27AE60' },
    { id: 'social-studies', name: 'Social Studies', color: '#F59E0B' },
  ];

  const handleSave = () => {
    saveSettings();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    resetSettings();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match');
      return;
    }
    setShowPasswordModal(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const exportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      subjects: subjects.map(s => ({ ...s, progress: Math.floor(Math.random() * 100) }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coteachers-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FBF9]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <motion.header 
          className="mb-12"
          initial={!reducedMotion ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <motion.h1 
                className="text-5xl font-bold text-[#0F1724] mb-3 bg-gradient-to-r from-[#0F1724] via-[#27AE60] to-[#22C1C3] bg-clip-text text-transparent"
                initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Settings
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 font-medium mb-4"
                initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Control your preferences, safety, and notifications
              </motion.p>
              <motion.nav
                initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <a
                  href="#/profile"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-[#27AE60] transition-colors duration-200 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Profile
                </a>
              </motion.nav>
            </div>
            
            <motion.div
              className="hidden lg:block"
              initial={!reducedMotion ? { scale: 0, rotate: -180 } : { scale: 1, rotate: 0 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 100 }}
            >
              <div className="p-4 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 rounded-3xl">
                <SettingsIcon className="w-12 h-12 text-[#27AE60]" />
              </div>
            </motion.div>
          </div>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-start gap-8 lg:grid-cols-[280px_1fr_360px] md:grid-cols-1"
        >
          {/* Enhanced Tabs Navigation */}
          <motion.div 
            className="lg:sticky lg:top-24 self-start"
            variants={itemVariants}
          >
            <Card className="p-6 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl">
              <h3 className="font-bold text-[#0F1724] text-lg mb-6 flex items-center">
                <div className="p-2 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 rounded-xl mr-3">
                  <SettingsIcon className="w-5 h-5 text-[#27AE60]" />
                </div>
                Settings Menu
              </h3>
              <nav className="space-y-3" role="tablist">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`${tab.id}-panel`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 font-semibold ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#27AE60] to-[#22C1C3] text-white shadow-xl scale-105'
                          : 'bg-white/80 text-gray-700 hover:bg-gray-50 shadow-sm ring-1 ring-black/5 hover:shadow-md hover:scale-102'
                      }`}
                      whileHover={!reducedMotion ? { scale: activeTab === tab.id ? 1.05 : 1.02, x: 2 } : {}}
                      whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                      initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={!reducedMotion ? { duration: 0.4, delay: index * 0.1 } : { duration: 0 }}
                    >
                      <div className={`p-2 rounded-xl ${
                        activeTab === tab.id 
                          ? 'bg-white/20' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-50'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </Card>
          </motion.div>

          {/* Enhanced Tab Content */}
          <motion.div variants={itemVariants}>
            <Card className="p-10 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl">
              <AnimatePresence mode="wait">
                {/* General Tab */}
                {activeTab === 'general' && (
                  <motion.div
                    key="general"
                    id="general-panel"
                    role="tabpanel"
                    initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={!reducedMotion ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-10"
                  >
                    <div className="flex items-center mb-8">
                      <div className="p-3 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 rounded-2xl mr-4">
                        <Palette className="w-8 h-8 text-[#27AE60]" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-[#0F1724]">General Settings</h2>
                        <p className="text-gray-600 font-medium">Customize your app appearance and behavior</p>
                      </div>
                    </div>
                    
                    {/* Theme Selection */}
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-6">Theme Appearance</label>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {[
                          { value: 'light', label: 'Light', icon: Monitor, desc: 'Clean and bright interface' },
                          { value: 'dim', label: 'Dim', icon: Moon, desc: 'Easier on the eyes' },
                          { value: 'hc', label: 'High Contrast', icon: Eye, desc: 'Enhanced accessibility' },
                        ].map((option, index) => {
                          const Icon = option.icon;
                          return (
                            <motion.label 
                              key={option.value} 
                              className="cursor-pointer"
                              whileHover={!reducedMotion ? { scale: 1.02 } : {}}
                              initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                              <input
                                type="radio"
                                name="theme"
                                value={option.value}
                                checked={settings.theme === option.value}
                                onChange={(e) => updateSettings({ theme: e.target.value as any })}
                                className="sr-only"
                              />
                              <div className={`flex flex-col items-center space-y-4 p-6 rounded-2xl border-3 transition-all duration-300 ${
                                settings.theme === option.value
                                  ? 'border-[#27AE60] bg-gradient-to-br from-[#27AE60]/5 to-[#22C1C3]/5 shadow-xl'
                                  : 'border-gray-200 hover:border-gray-300 bg-white shadow-sm hover:shadow-md'
                              }`}>
                                <div className={`p-4 rounded-2xl ${
                                  settings.theme === option.value 
                                    ? 'bg-[#27AE60] text-white shadow-lg' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <Icon className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                  <span className="font-bold text-[#0F1724] text-lg">{option.label}</span>
                                  <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                                </div>
                              </div>
                            </motion.label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Language & Timezone */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <label htmlFor="language" className="block text-lg font-bold text-gray-700 mb-4">
                          Language
                        </label>
                        <select
                          id="language"
                          value={settings.language}
                          onChange={(e) => updateSettings({ language: e.target.value as any })}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <option value="en">English</option>
                        </select>
                      </motion.div>

                      <motion.div
                        initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <label htmlFor="timezone" className="block text-lg font-bold text-gray-700 mb-4">
                          Time Zone
                        </label>
                        <input
                          id="timezone"
                          type="text"
                          value={settings.timezone}
                          onChange={(e) => updateSettings({ timezone: e.target.value })}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                        />
                      </motion.div>
                    </div>

                    {/* Settings Toggles */}
                    <div className="space-y-6">
                      {[
                        { 
                          key: 'reducedMotion', 
                          label: 'Reduce animations', 
                          desc: 'Minimize motion effects throughout the app',
                          icon: Zap,
                          color: '#FF6B6B'
                        },
                        { 
                          key: 'cursorHalo', 
                          label: 'Cursor halo effect', 
                          desc: 'Show interactive cursor trail (desktop only)',
                          icon: Monitor,
                          color: '#22C1C3'
                        },
                        { 
                          key: 'sfx', 
                          label: 'Sound effects', 
                          desc: 'Play subtle sounds for interactions',
                          icon: Volume2,
                          color: '#F59E0B'
                        },
                        { 
                          key: 'parallax', 
                          label: 'Parallax decorations', 
                          desc: 'Enable floating background shapes',
                          icon: Globe,
                          color: '#6C5CE7'
                        }
                      ].map((setting, index) => {
                        const Icon = setting.icon;
                        return (
                          <motion.label 
                            key={setting.key}
                            className="flex items-center justify-between cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group"
                            whileHover={!reducedMotion ? { scale: 1.01, x: 4 } : {}}
                            initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <div className="flex items-center space-x-4">
                              <div 
                                className="p-3 rounded-2xl shadow-sm"
                                style={{ backgroundColor: `${setting.color}15` }}
                              >
                                <Icon className="w-6 h-6" style={{ color: setting.color }} />
                              </div>
                              <div>
                                <div className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">{setting.label}</div>
                                <div className="text-sm text-gray-600">{setting.desc}</div>
                              </div>
                            </div>
                            <motion.input
                              type="checkbox"
                              checked={settings[setting.key as keyof typeof settings] as boolean}
                              onChange={(e) => updateSettings({ [setting.key]: e.target.checked })}
                              className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                              whileHover={!reducedMotion ? { scale: 1.1 } : {}}
                            />
                          </motion.label>
                        );
                      })}
                    </div>

                    {/* Kid Flair Level */}
                    <motion.div
                      initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <label htmlFor="kidFlair" className="block text-lg font-bold text-gray-700 mb-4">
                        Kid Flair Level
                      </label>
                      <div className="flex items-center space-x-6">
                        <span className="text-sm text-gray-500 font-semibold">Subtle</span>
                        <input
                          id="kidFlair"
                          type="range"
                          min="0"
                          max="3"
                          value={settings.kidFlairLevel}
                          onChange={(e) => updateSettings({ kidFlairLevel: parseInt(e.target.value) })}
                          className="flex-1 h-3 bg-gradient-to-r from-gray-200 to-[#27AE60]/20 rounded-full appearance-none cursor-pointer slider"
                        />
                        <span className="text-sm text-gray-500 font-semibold">Playful</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">Controls wobble and particle intensity throughout the app</p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Learning Tab */}
                {activeTab === 'learning' && (
                  <motion.div
                    key="learning"
                    id="learning-panel"
                    role="tabpanel"
                    initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={!reducedMotion ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-10"
                  >
                    <div className="flex items-center mb-8">
                      <div className="p-3 bg-gradient-to-r from-[#22C1C3]/10 to-[#27AE60]/10 rounded-2xl mr-4">
                        <Globe className="w-8 h-8 text-[#22C1C3]" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-[#0F1724]">Learning Preferences</h2>
                        <p className="text-gray-600 font-medium">Customize your educational experience</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Left Column */}
                      <div className="space-y-10">
                        {/* Preferred Pace */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <label className="block text-lg font-bold text-gray-700 mb-6">Preferred Learning Pace</label>
                          <div className="space-y-4">
                            {[
                              { value: 'gentle', label: 'Gentle', desc: 'Take your time to understand concepts', color: '#27AE60' },
                              { value: 'standard', label: 'Standard', desc: 'Balanced learning approach', color: '#22C1C3' },
                              { value: 'fast', label: 'Fast', desc: 'Quick progression through materials', color: '#FF6B6B' },
                            ].map((option, index) => (
                              <motion.label 
                                key={option.value} 
                                className="flex items-start space-x-4 cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group"
                                whileHover={!reducedMotion ? { scale: 1.01, x: 4 } : {}}
                                initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                              >
                                <input
                                  type="radio"
                                  name="pace"
                                  value={option.value}
                                  checked={settings.pace === option.value}
                                  onChange={(e) => updateSettings({ pace: e.target.value as any })}
                                  className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 mt-1 scale-125"
                                />
                                <div className="flex items-center space-x-3 flex-1">
                                  <div 
                                    className="w-4 h-4 rounded-full shadow-sm"
                                    style={{ backgroundColor: option.color }}
                                  />
                                  <div>
                                    <div className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">{option.label}</div>
                                    <div className="text-sm text-gray-600">{option.desc}</div>
                                  </div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                        </motion.div>

                        {/* Practice Mode */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <label htmlFor="practiceMode" className="block text-lg font-bold text-gray-700 mb-4">
                            Practice Mode
                          </label>
                          <select
                            id="practiceMode"
                            value={settings.practiceMode}
                            onChange={(e) => updateSettings({ practiceMode: e.target.value as any })}
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <option value="mixed">Mixed Practice</option>
                            <option value="concept">Concept-first</option>
                            <option value="quiz">Quiz-first</option>
                          </select>
                        </motion.div>

                        {/* Daily Goal */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <label htmlFor="dailyGoal" className="block text-lg font-bold text-gray-700 mb-4">
                            Daily Goal (minutes)
                          </label>
                          <div className="flex items-center space-x-6">
                            <span className="text-sm text-gray-500 font-semibold">15</span>
                            <input
                              id="dailyGoal"
                              type="range"
                              min="15"
                              max="120"
                              step="15"
                              value={settings.dailyGoal}
                              onChange={(e) => updateSettings({ dailyGoal: parseInt(e.target.value) })}
                              className="flex-1 h-3 bg-gradient-to-r from-gray-200 to-[#27AE60]/20 rounded-full appearance-none cursor-pointer slider"
                            />
                            <span className="text-sm text-gray-500 font-semibold">120</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-3">Current goal: <span className="font-bold text-[#27AE60]">{settings.dailyGoal} minutes</span></p>
                        </motion.div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-10">
                        {/* Focus Subjects */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <label className="block text-lg font-bold text-gray-700 mb-6">Focus Subjects</label>
                          <div className="space-y-4">
                            {subjects.map((subject, index) => (
                              <motion.label 
                                key={subject.id} 
                                className="flex items-center space-x-4 cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group"
                                whileHover={!reducedMotion ? { scale: 1.01, x: 4 } : {}}
                                initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                              >
                                <input
                                  type="checkbox"
                                  checked={settings.focusSubjects.includes(subject.id)}
                                  onChange={(e) => {
                                    const newSubjects = e.target.checked
                                      ? [...settings.focusSubjects, subject.id]
                                      : settings.focusSubjects.filter(id => id !== subject.id);
                                    updateSettings({ focusSubjects: newSubjects });
                                  }}
                                  className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                                />
                                <div className="flex items-center space-x-3">
                                  <div 
                                    className="w-6 h-6 rounded-full shadow-lg"
                                    style={{ backgroundColor: subject.color }}
                                  />
                                  <span className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">{subject.name}</span>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                        </motion.div>

                        {/* Content Level & Safety */}
                        <motion.div
                          className="space-y-6"
                          initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <div>
                            <label htmlFor="contentLevel" className="block text-lg font-bold text-gray-700 mb-4">
                              Content Level
                            </label>
                            <select
                              id="contentLevel"
                              value={settings.contentLevel}
                              onChange={(e) => updateSettings({ contentLevel: e.target.value as any })}
                              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <option value="basic">Basic</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>

                          <label className="flex items-center justify-between cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 rounded-2xl">
                                <Shield className="w-6 h-6 text-[#27AE60]" />
                              </div>
                              <div>
                                <div className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">Kid-safe filters</div>
                                <div className="text-sm text-gray-600">Hides external links and public chats</div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.safeContent}
                              onChange={(e) => updateSettings({ safeContent: e.target.checked })}
                              className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                            />
                          </label>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    id="notifications-panel"
                    role="tabpanel"
                    initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={!reducedMotion ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-10"
                  >
                    <div className="flex items-center mb-8">
                      <div className="p-3 bg-gradient-to-r from-[#F59E0B]/10 to-[#FF6B6B]/10 rounded-2xl mr-4">
                        <Bell className="w-8 h-8 text-[#F59E0B]" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-[#0F1724]">Notification Settings</h2>
                        <p className="text-gray-600 font-medium">Control how and when you receive updates</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Left Column */}
                      <div className="space-y-8">
                        {/* Channel Toggles */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <label className="block text-lg font-bold text-gray-700 mb-6">Notification Channels</label>
                          <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-[#22C1C3]/10 to-[#22C1C3]/5 rounded-2xl">
                                  <Mail className="w-6 h-6 text-[#22C1C3]" />
                                </div>
                                <div>
                                  <span className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">Email Notifications</span>
                                  <p className="text-sm text-gray-600">Receive updates via email</p>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={settings.notifications.channel.email}
                                onChange={(e) => updateSettings({
                                  notifications: {
                                    ...settings.notifications,
                                    channel: { ...settings.notifications.channel, email: e.target.checked }
                                  }
                                })}
                                className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                              />
                            </label>
                            
                            <label className="flex items-center justify-between cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 rounded-2xl">
                                  <Bell className="w-6 h-6 text-[#F59E0B]" />
                                </div>
                                <div>
                                  <span className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">In-app Notifications</span>
                                  <p className="text-sm text-gray-600">Show alerts within the app</p>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={settings.notifications.channel.app}
                                onChange={(e) => updateSettings({
                                  notifications: {
                                    ...settings.notifications,
                                    channel: { ...settings.notifications.channel, app: e.target.checked }
                                  }
                                })}
                                className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                              />
                            </label>
                          </div>
                        </motion.div>

                        {/* Frequency */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <label htmlFor="frequency" className="block text-lg font-bold text-gray-700 mb-4">
                            Notification Frequency
                          </label>
                          <select
                            id="frequency"
                            value={settings.notifications.frequency}
                            onChange={(e) => updateSettings({
                              notifications: {
                                ...settings.notifications,
                                frequency: e.target.value as any
                              }
                            })}
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <option value="off">Off</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </motion.div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-8">
                        {/* Events */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <label className="block text-lg font-bold text-gray-700 mb-6">Notification Events</label>
                          <div className="space-y-4">
                            {[
                              { key: 'lessonReminders', label: 'Lesson reminders', icon: Clock, color: '#22C1C3' },
                              { key: 'newBadges', label: 'New badges earned', icon: Bell, color: '#F59E0B' },
                              { key: 'weeklySummary', label: 'Weekly progress summary', icon: Mail, color: '#27AE60' },
                              { key: 'parentSummary', label: 'Parent summary (email)', icon: Users, color: '#6C5CE7' },
                            ].map((event, index) => {
                              const Icon = event.icon;
                              return (
                                <motion.label 
                                  key={event.key} 
                                  className="flex items-center justify-between cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group"
                                  whileHover={!reducedMotion ? { scale: 1.01, x: 4 } : {}}
                                  initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div 
                                      className="p-3 rounded-2xl shadow-sm"
                                      style={{ backgroundColor: `${event.color}15` }}
                                    >
                                      <Icon className="w-6 h-6" style={{ color: event.color }} />
                                    </div>
                                    <span className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">{event.label}</span>
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={settings.notifications.events[event.key as keyof typeof settings.notifications.events]}
                                    onChange={(e) => updateSettings({
                                      notifications: {
                                        ...settings.notifications,
                                        events: {
                                          ...settings.notifications.events,
                                          [event.key]: e.target.checked
                                        }
                                      }
                                    })}
                                    className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                                  />
                                </motion.label>
                              );
                            })}
                          </div>
                        </motion.div>

                        {/* Quiet Hours */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <label className="block text-lg font-bold text-gray-700 mb-6">Quiet Hours</label>
                          <div className="flex items-center space-x-6">
                            <div className="flex-1">
                              <label htmlFor="quietStart" className="block text-sm font-semibold text-gray-600 mb-2">Start Time</label>
                              <input
                                id="quietStart"
                                type="time"
                                value={settings.notifications.quiet.start}
                                onChange={(e) => updateSettings({
                                  notifications: {
                                    ...settings.notifications,
                                    quiet: { ...settings.notifications.quiet, start: e.target.value }
                                  }
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                              />
                            </div>
                            <div className="flex-1">
                              <label htmlFor="quietEnd" className="block text-sm font-semibold text-gray-600 mb-2">End Time</label>
                              <input
                                id="quietEnd"
                                type="time"
                                value={settings.notifications.quiet.end}
                                onChange={(e) => updateSettings({
                                  notifications: {
                                    ...settings.notifications,
                                    quiet: { ...settings.notifications.quiet, end: e.target.value }
                                  }
                                })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-4">No notifications will be sent during these hours (local time)</p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Privacy & Security Tab */}
                {activeTab === 'privacy' && (
                  <motion.div
                    key="privacy"
                    id="privacy-panel"
                    role="tabpanel"
                    initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={!reducedMotion ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-10"
                  >
                    <div className="flex items-center mb-8">
                      <div className="p-3 bg-gradient-to-r from-[#FF6B6B]/10 to-[#6C5CE7]/10 rounded-2xl mr-4">
                        <Shield className="w-8 h-8 text-[#FF6B6B]" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-[#0F1724]">Privacy & Security</h2>
                        <p className="text-gray-600 font-medium">Manage your data and account security</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Left Column */}
                      <div className="space-y-8">
                        {/* Profile Visibility */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <label className="block text-lg font-bold text-gray-700 mb-6">Profile Visibility</label>
                          <div className="space-y-4">
                            {[
                              { value: 'private', label: 'Private', desc: 'Only you can see your profile', color: '#27AE60' },
                              { value: 'class', label: 'Class only', desc: 'Visible to classmates and teachers', color: '#22C1C3' },
                              { value: 'public', label: 'Public', desc: 'Visible to everyone (disabled)', color: '#FF6B6B', disabled: true },
                            ].map((option, index) => (
                              <motion.label 
                                key={option.value} 
                                className={`flex items-start space-x-4 cursor-pointer p-6 rounded-2xl transition-all duration-300 border-2 border-gray-200 ${
                                  option.disabled 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-gray-50/80 hover:border-gray-300 group'
                                }`}
                                whileHover={!reducedMotion && !option.disabled ? { scale: 1.01, x: 4 } : {}}
                                initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                              >
                                <input
                                  type="radio"
                                  name="visibility"
                                  value={option.value}
                                  checked={settings.privacy.visibility === option.value}
                                  onChange={(e) => updateSettings({
                                    privacy: { ...settings.privacy, visibility: e.target.value as any }
                                  })}
                                  disabled={option.disabled}
                                  className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 mt-1 scale-125"
                                />
                                <div className="flex items-center space-x-3 flex-1">
                                  <div 
                                    className="w-4 h-4 rounded-full shadow-sm"
                                    style={{ backgroundColor: option.color }}
                                  />
                                  <div>
                                    <div className={`font-bold text-[#0F1724] text-lg ${!option.disabled ? 'group-hover:text-[#27AE60]' : ''} transition-colors duration-200`}>{option.label}</div>
                                    <div className="text-sm text-gray-600">{option.desc}</div>
                                  </div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                        </motion.div>

                        {/* Data Export */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <label className="block text-lg font-bold text-gray-700 mb-4">Data Export</label>
                          <motion.button
                            onClick={exportData}
                            className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 shadow-sm hover:shadow-md font-semibold"
                            whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                          >
                            <Download className="w-5 h-5" />
                            <span>Download my data (JSON)</span>
                          </motion.button>
                          <p className="text-sm text-gray-600 mt-3">Export all your learning data and preferences</p>
                        </motion.div>

                        {/* Change Password */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <label className="block text-lg font-bold text-gray-700 mb-4">Account Security</label>
                          <motion.button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-[#27AE60] to-[#22C1C3] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2"
                            whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                          >
                            <Key className="w-5 h-5" />
                            <span>Change Password</span>
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-8">
                        {/* Connected Devices */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <label className="block text-lg font-bold text-gray-700 mb-6">Connected Devices</label>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-sm ring-1 ring-black/5">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-[#22C1C3]/10 to-[#22C1C3]/5 rounded-2xl">
                                  <Monitor className="w-6 h-6 text-[#22C1C3]" />
                                </div>
                                <div>
                                  <div className="font-bold text-[#0F1724]">Chrome on Windows</div>
                                  <div className="text-sm text-gray-500">Current session</div>
                                </div>
                              </div>
                              <span className="text-xs text-[#27AE60] font-bold px-3 py-1 bg-[#27AE60]/10 rounded-full">Active</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-sm ring-1 ring-black/5">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 rounded-2xl">
                                  <Smartphone className="w-6 h-6 text-[#F59E0B]" />
                                </div>
                                <div>
                                  <div className="font-bold text-[#0F1724]">Mobile App</div>
                                  <div className="text-sm text-gray-500">Last used 2 days ago</div>
                                </div>
                              </div>
                              <button className="text-xs text-gray-500 hover:text-[#FF6B6B] transition-colors duration-200 font-semibold">
                                Sign out
                              </button>
                            </div>
                          </div>
                          <button className="mt-4 text-sm text-gray-600 hover:text-[#FF6B6B] transition-colors duration-200 font-semibold">
                            Sign out all other devices
                          </button>
                        </motion.div>

                        {/* Two-Factor Auth */}
                        <motion.div
                          initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <label className="flex items-center justify-between cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-gradient-to-r from-[#6C5CE7]/10 to-[#6C5CE7]/5 rounded-2xl">
                                <Lock className="w-6 h-6 text-[#6C5CE7]" />
                              </div>
                              <div>
                                <div className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">Two-factor authentication</div>
                                <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.privacy.twoFA}
                              onChange={(e) => updateSettings({
                                privacy: { ...settings.privacy, twoFA: e.target.checked }
                              })}
                              className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                            />
                          </label>
                        </motion.div>

                        {/* Danger Zone */}
                        <motion.div
                          className="border-3 border-[#FF6B6B]/20 rounded-2xl p-6 bg-gradient-to-br from-[#FF6B6B]/5 to-[#FF6B6B]/10"
                          initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                        >
                          <div className="flex items-center mb-4">
                            <div className="p-2 bg-[#FF6B6B]/10 rounded-xl mr-3">
                              <AlertTriangle className="w-6 h-6 text-[#FF6B6B]" />
                            </div>
                            <h3 className="font-bold text-[#FF6B6B] text-lg">Danger Zone</h3>
                          </div>
                          <p className="text-sm text-[#FF6B6B]/80 mb-6 font-medium">These actions cannot be undone and may result in permanent data loss.</p>
                          <button
                            disabled
                            className="flex items-center space-x-3 px-6 py-3 bg-[#FF6B6B]/10 text-[#FF6B6B]/50 rounded-2xl cursor-not-allowed font-semibold"
                          >
                            <Trash2 className="w-5 h-5" />
                            <span>Delete Account</span>
                          </button>
                          <p className="text-xs text-[#FF6B6B]/60 mt-3 font-medium">Account deletion requires parent/guardian approval</p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Enhanced Live Preview Panel */}
          <motion.div 
            className="lg:sticky lg:top-24 self-start"
            variants={itemVariants}
          >
            <Card className="p-6 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 rounded-xl mr-3">
                  <Eye className="w-6 h-6 text-[#27AE60]" />
                </div>
                <h3 className="font-bold text-[#0F1724] text-xl">Live Preview</h3>
              </div>
              
              {/* Sample Card */}
              <motion.div 
                className="mb-6"
                whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className={`p-4 rounded-2xl transition-all duration-300 shadow-lg ring-1 ring-black/5 ${
                    settings.theme === 'hc' ? 'bg-black text-white font-semibold' :
                    settings.theme === 'dim' ? 'bg-gray-800 text-gray-100' :
                    'bg-white text-[#0F1724]'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <StickerIcon 
                      icon={<span className="text-lg">📚</span>} 
                      accent="#22C1C3" 
                      size="sm"
                    />
                    <span className="font-bold text-sm">Sample Card</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <motion.div 
                      className="h-2 rounded-full bg-[#22C1C3]" 
                      initial={{ width: 0 }}
                      animate={{ width: '68%' }}
                      transition={!reducedMotion ? { duration: 1, delay: 0.5 } : { duration: 0 }}
                    />
                  </div>
                  <div className="text-xs opacity-75">68% complete</div>
                </div>
              </motion.div>

              {/* Goal Ring Preview */}
              <div className="mb-6">
                <GoalRing 
                  progress={(35 / settings.dailyGoal) * 100} 
                  size={50}
                  strokeWidth={4}
                  label="Daily Goal"
                />
              </div>

              {/* Settings Summary */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Theme:</span>
                  <span className="font-bold text-[#27AE60]">{settings.theme.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Animations:</span>
                  <span className="font-bold text-[#27AE60]">{settings.reducedMotion ? 'OFF' : 'ON'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Kid Flair:</span>
                  <span className="font-bold text-[#27AE60]">{settings.kidFlairLevel}/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Daily Goal:</span>
                  <span className="font-bold text-[#27AE60]">{settings.dailyGoal}m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Focus Subjects:</span>
                  <span className="font-bold text-[#27AE60]">{settings.focusSubjects.length}</span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 mt-6">
              <motion.button
                onClick={handleSave}
                className="flex items-center justify-center space-x-3 bg-gradient-to-r from-[#27AE60] via-[#27AE60] to-[#22C1C3] text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 relative overflow-hidden group"
                whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                whileTap={!reducedMotion ? { scale: 0.98 } : {}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Save className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Save Settings</span>
              </motion.button>
              
              <motion.button
                onClick={handleReset}
                className="flex items-center justify-center space-x-3 px-8 py-4 text-gray-700 hover:text-[#0F1724] bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-[#27AE60]/30 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 shadow-lg hover:shadow-xl"
                whileHover={!reducedMotion ? { scale: 1.02 } : {}}
                whileTap={!reducedMotion ? { scale: 0.98 } : {}}
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset to Defaults</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 -mx-8 -mt-8 rounded-t-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 rounded-2xl mr-4">
                      <Key className="w-8 h-8 text-[#27AE60]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F1724]">Change Password</h3>
                  </div>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-bold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent bg-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-4 pt-4">
                      <motion.button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-[#27AE60] to-[#22C1C3] text-white py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2"
                        whileHover={!reducedMotion ? { scale: 1.02 } : {}}
                        whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                      >
                        Update Password
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                        whileHover={!reducedMotion ? { scale: 1.02 } : {}}
                        whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Toast */}
        <Toast 
          show={showToast}
          message="🎉 Settings saved successfully!"
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
};

export default SettingsPage;