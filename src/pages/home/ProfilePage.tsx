import React, { useState } from 'react';
import { ArrowLeft, User, Mail, GraduationCap, Save, RotateCcw, Bell, Shield, Sparkles as SparklesIcon, Settings, Edit3, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from './contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from './components/Card';
import { Toast } from './components/Toast';
import { useReducedMotionSetting } from './lib/useReducedMotionSetting';

const ProfilePage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { currentUser } = useAuth();
  const reducedMotion = useReducedMotionSetting();
  const [preferences, setPreferences] = useState({
    pace: settings.pace,
    practiceMode: settings.practiceMode,
    focusSubjects: settings.focusSubjects,
    emailNotifications: true,
    appNotifications: true,
    reduceAnimations: settings.reducedMotion,
  });

  const [showToast, setShowToast] = useState(false);
  const [parentEmail, setParentEmail] = useState('parent@example.com');
  const [avatarBg, setAvatarBg] = useState('#27AE60');
  const [isEditing, setIsEditing] = useState(false);

  const avatarColors = ['#27AE60', '#22C1C3', '#FF6B6B', '#F59E0B', '#6C5CE7', '#2B6CB0'];
  
  // Get user data from Firebase
  const getUserName = () => {
    return currentUser?.displayName || 'User';
  };
  
  const getUserEmail = () => {
    return currentUser?.email || 'user@example.com';
  };
  
  // Generate initials from user's name
  const getUserInitials = () => {
    const name = getUserName();
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const randomizeAvatar = () => {
    const currentIndex = avatarColors.indexOf(avatarBg);
    const nextIndex = (currentIndex + 1) % avatarColors.length;
    setAvatarBg(avatarColors[nextIndex]);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    if (key === 'pace') updateSettings({ pace: value });
    if (key === 'practiceMode') updateSettings({ practiceMode: value });
    if (key === 'focusSubjects') updateSettings({ focusSubjects: value });
    if (key === 'reduceAnimations') updateSettings({ reducedMotion: value });
  };

  const handleSubjectToggle = (subjectId: string) => {
    const newSubjects = preferences.focusSubjects.includes(subjectId)
      ? preferences.focusSubjects.filter(id => id !== subjectId)
      : [...preferences.focusSubjects, subjectId];
    
    setPreferences(prev => ({ ...prev, focusSubjects: newSubjects }));
    updateSettings({ focusSubjects: newSubjects });
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    setPreferences({
      pace: 'standard',
      practiceMode: 'mixed',
      focusSubjects: ['english', 'mathematics', 'science', 'social-studies'],
      emailNotifications: true,
      appNotifications: true,
      reduceAnimations: false,
    });
    setParentEmail('parent@example.com');
  };

  const subjects = [
    { id: 'english', name: 'English', color: '#22C1C3' },
    { id: 'mathematics', name: 'Mathematics', color: '#FF6B6B' },
    { id: 'science', name: 'Science', color: '#27AE60' },
    { id: 'social-studies', name: 'Social Studies', color: '#F59E0B' },
  ];

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
                Your Profile
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 font-medium"
                initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Manage your information, preferences, and privacy settings
              </motion.p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.a
                href="#/home"
                className="flex items-center space-x-3 px-8 py-4 text-gray-700 hover:text-[#0F1724] bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-black/5 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 font-semibold"
                whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </motion.a>
              
              <motion.a
                href="#/settings"
                className="flex items-center space-x-3 bg-gradient-to-r from-[#27AE60] via-[#27AE60] to-[#22C1C3] text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 relative overflow-hidden group"
                whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Settings className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Settings</span>
              </motion.a>
            </div>
          </div>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Enhanced Preferences Preview Bar */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-[#27AE60]/8 via-[#22C1C3]/5 to-[#F59E0B]/5 -mx-8 -mt-8 rounded-t-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 rounded-2xl mr-4">
                    <SparklesIcon className="w-8 h-8 text-[#27AE60]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F1724]">Current Preferences</h2>
                    <p className="text-gray-600 font-medium">Your personalized learning settings</p>
                  </div>
                </div>
                
                <motion.div 
                  className="flex flex-wrap gap-4"
                  layout={!reducedMotion}
                >
                  <motion.span 
                    className="px-6 py-3 bg-gradient-to-r from-[#27AE60]/10 to-[#27AE60]/5 text-[#27AE60] rounded-2xl text-sm font-bold border-2 border-[#27AE60]/20 shadow-lg"
                    layout={!reducedMotion}
                    initial={!reducedMotion ? { scale: 0, rotate: -10 } : { scale: 1, rotate: 0 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={!reducedMotion ? { duration: 0.4, type: "spring", stiffness: 200 } : { duration: 0 }}
                    whileHover={!reducedMotion ? { scale: 1.05, rotate: 2 } : {}}
                  >
                    {preferences.pace.charAt(0).toUpperCase() + preferences.pace.slice(1)} Pace
                  </motion.span>
                  
                  <motion.span 
                    className="px-6 py-3 bg-gradient-to-r from-[#22C1C3]/10 to-[#22C1C3]/5 text-[#22C1C3] rounded-2xl text-sm font-bold border-2 border-[#22C1C3]/20 shadow-lg"
                    layout={!reducedMotion}
                    initial={!reducedMotion ? { scale: 0, rotate: 10 } : { scale: 1, rotate: 0 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={!reducedMotion ? { duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 } : { duration: 0 }}
                    whileHover={!reducedMotion ? { scale: 1.05, rotate: -2 } : {}}
                  >
                    {preferences.practiceMode === 'mixed' ? 'Mixed Practice' : 
                     preferences.practiceMode === 'concept' ? 'Concept First' : 'Quiz First'}
                  </motion.span>
                  
                  <motion.span 
                    className="px-6 py-3 bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 text-[#F59E0B] rounded-2xl text-sm font-bold border-2 border-[#F59E0B]/20 shadow-lg"
                    layout={!reducedMotion}
                    initial={!reducedMotion ? { scale: 0, rotate: -5 } : { scale: 1, rotate: 0 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={!reducedMotion ? { duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 } : { duration: 0 }}
                    whileHover={!reducedMotion ? { scale: 1.05, rotate: 3 } : {}}
                  >
                    {preferences.focusSubjects.length} Focus Subject{preferences.focusSubjects.length !== 1 ? 's' : ''}
                  </motion.span>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Enhanced Identity Section */}
          <motion.section variants={itemVariants}>
            <Card className="p-10 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#27AE60]/8 via-[#22C1C3]/5 to-transparent -mx-10 -mt-10 rounded-t-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-gradient-to-r from-[#6C5CE7]/10 to-[#2B6CB0]/10 rounded-2xl mr-4">
                    <User className="w-8 h-8 text-[#6C5CE7]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#0F1724]">Identity</h2>
                    <p className="text-gray-600 font-medium">Your personal information and avatar</p>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-8 lg:space-y-0 lg:space-x-12">
                  <div className="relative group">
                    <motion.div 
                      className="w-32 h-32 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-white/50 relative overflow-hidden"
                      style={{ backgroundColor: avatarBg }}
                      whileHover={!reducedMotion ? { scale: 1.05, rotate: 3 } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      <span className="relative z-10">{getUserInitials()}</span>
                    </motion.div>
                    
                    <motion.button
                      onClick={randomizeAvatar}
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 group-hover:scale-110"
                      title="Randomize avatar color"
                      whileHover={!reducedMotion ? { scale: 1.1, rotate: 180 } : {}}
                      whileTap={!reducedMotion ? { scale: 0.9 } : {}}
                    >
                      <Camera className="w-6 h-6 text-[#27AE60]" />
                    </motion.button>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <motion.div 
                        className="space-y-3"
                        whileHover={!reducedMotion ? { scale: 1.02 } : {}}
                      >
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Name</label>
                        <div className="flex items-center space-x-4 text-[#0F1724] p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow duration-300">
                          <User className="w-6 h-6 text-[#27AE60]" />
                          <span className="font-semibold text-lg">{getUserName()}</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-3"
                        whileHover={!reducedMotion ? { scale: 1.02 } : {}}
                      >
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Email</label>
                        <div className="flex items-center space-x-4 text-[#0F1724] p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow duration-300">
                          <Mail className="w-6 h-6 text-[#22C1C3]" />
                          <span className="font-semibold">{getUserEmail()}</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-3"
                        whileHover={!reducedMotion ? { scale: 1.02 } : {}}
                      >
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Grade</label>
                        <div className="flex items-center space-x-4 text-[#0F1724] p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow duration-300">
                          <GraduationCap className="w-6 h-6 text-[#F59E0B]" />
                          <span className="font-semibold">Grade 8</span>
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center space-x-6 mt-8">
                      <motion.button 
                        className="flex items-center space-x-3 bg-gradient-to-r from-[#27AE60] to-[#22C1C3] text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 relative overflow-hidden group"
                        whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Edit3 className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Edit Profile</span>
                      </motion.button>
                      
                      <motion.button 
                        className="flex items-center space-x-3 px-8 py-4 text-gray-700 hover:text-[#0F1724] bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-[#27AE60]/30 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 shadow-lg hover:shadow-xl"
                        whileHover={!reducedMotion ? { scale: 1.02 } : {}}
                        whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                      >
                        <Shield className="w-5 h-5" />
                        <span>Privacy</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Enhanced Learning Preferences */}
          <motion.section variants={itemVariants}>
            <Card className="p-10 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-[#FF6B6B]/10 to-[#F59E0B]/10 rounded-2xl mr-4">
                  <GraduationCap className="w-8 h-8 text-[#FF6B6B]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0F1724]">Learning Preferences</h2>
                  <p className="text-gray-600 font-medium">Customize your learning experience</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Left Column */}
                <div className="space-y-10">
                  {/* Preferred Pace */}
                  <motion.div
                    initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <label className="block text-xl font-bold text-gray-700 mb-6">Preferred Learning Pace</label>
                    <div className="space-y-4">
                      {[
                        { value: 'gentle', label: 'Gentle', desc: 'Take your time to understand concepts thoroughly', color: '#27AE60' },
                        { value: 'standard', label: 'Standard', desc: 'Balanced learning approach with steady progress', color: '#22C1C3' },
                        { value: 'fast', label: 'Fast', desc: 'Quick progression through materials and challenges', color: '#FF6B6B' },
                      ].map((option, index) => (
                        <motion.label 
                          key={option.value} 
                          className="flex items-center space-x-6 cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 group border-2 border-transparent hover:border-gray-200"
                          whileHover={!reducedMotion ? { scale: 1.01, x: 4 } : {}}
                          initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <motion.input
                            type="radio"
                            name="pace"
                            value={option.value}
                            checked={preferences.pace === option.value}
                            onChange={(e) => handlePreferenceChange('pace', e.target.value)}
                            className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 scale-125"
                            whileHover={!reducedMotion ? { scale: 1.1 } : {}}
                          />
                          <div className="flex items-center space-x-4 flex-1">
                            <div 
                              className="w-4 h-4 rounded-full shadow-sm"
                              style={{ backgroundColor: option.color }}
                            />
                            <div>
                              <div className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">{option.label}</div>
                              <div className="text-sm text-gray-600 leading-relaxed">{option.desc}</div>
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
                    <label className="block text-xl font-bold text-gray-700 mb-4">Practice Mode</label>
                    <motion.select
                      value={preferences.practiceMode}
                      onChange={(e) => handlePreferenceChange('practiceMode', e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all duration-200 bg-white text-[#0F1724] font-semibold text-lg shadow-sm hover:shadow-md"
                      whileHover={!reducedMotion ? { scale: 1.01 } : {}}
                      whileFocus={!reducedMotion ? { scale: 1.01 } : {}}
                    >
                      <option value="mixed">Mixed Practice</option>
                      <option value="concept-first">Concept-first</option>
                      <option value="quiz-first">Quiz-first</option>
                    </motion.select>
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
                    <label className="block text-xl font-bold text-gray-700 mb-6">Focus Subjects</label>
                    <div className="space-y-4">
                      {subjects.map((subject, index) => (
                        <motion.label 
                          key={subject.id} 
                          className="flex items-center space-x-6 cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group"
                          whileHover={!reducedMotion ? { scale: 1.01, x: 4 } : {}}
                          whileTap={!reducedMotion ? { scale: 0.99 } : {}}
                          initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <motion.input
                            type="checkbox"
                            checked={preferences.focusSubjects.includes(subject.id)}
                            onChange={() => handleSubjectToggle(subject.id)}
                            className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                            whileHover={!reducedMotion ? { scale: 1.1 } : {}}
                          />
                          <div className="flex items-center space-x-4">
                            <motion.div 
                              className="w-6 h-6 rounded-full shadow-lg"
                              style={{ backgroundColor: subject.color }}
                              animate={preferences.focusSubjects.includes(subject.id) && !reducedMotion ? { 
                                scale: [1, 1.2, 1],
                                rotate: [0, 360, 0]
                              } : {}}
                              transition={{ duration: 0.5 }}
                            />
                            <span className="font-bold text-[#0F1724] text-lg group-hover:text-[#27AE60] transition-colors duration-200">{subject.name}</span>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>

                  {/* Notifications & Settings */}
                  <motion.div
                    className="space-y-6"
                    initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <label className="block text-xl font-bold text-gray-700 mb-4">Notifications & Preferences</label>
                    
                    <div className="space-y-4">
                      <motion.label 
                        className="flex items-center justify-between cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group"
                        whileHover={!reducedMotion ? { scale: 1.01 } : {}}
                      >
                        <div className="flex items-center space-x-4">
                          <Mail className="w-6 h-6 text-[#22C1C3]" />
                          <div>
                            <span className="font-bold text-[#0F1724] group-hover:text-[#27AE60] transition-colors duration-200">Email Notifications</span>
                            <p className="text-sm text-gray-600">Receive updates via email</p>
                          </div>
                        </div>
                        <motion.input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                          className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                          whileHover={!reducedMotion ? { scale: 1.1 } : {}}
                        />
                      </motion.label>
                      
                      <motion.label 
                        className="flex items-center justify-between cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group"
                        whileHover={!reducedMotion ? { scale: 1.01 } : {}}
                      >
                        <div className="flex items-center space-x-4">
                          <Bell className="w-6 h-6 text-[#F59E0B]" />
                          <div>
                            <span className="font-bold text-[#0F1724] group-hover:text-[#27AE60] transition-colors duration-200">App Notifications</span>
                            <p className="text-sm text-gray-600">In-app alerts and reminders</p>
                          </div>
                        </div>
                        <motion.input
                          type="checkbox"
                          checked={preferences.appNotifications}
                          onChange={(e) => handlePreferenceChange('appNotifications', e.target.checked)}
                          className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                          whileHover={!reducedMotion ? { scale: 1.1 } : {}}
                        />
                      </motion.label>
                      
                      <motion.label 
                        className="flex items-center justify-between cursor-pointer p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 group"
                        whileHover={!reducedMotion ? { scale: 1.01 } : {}}
                      >
                        <div>
                          <div className="font-bold text-[#0F1724] group-hover:text-[#27AE60] transition-colors duration-200">Reduce animations</div>
                          <div className="text-sm text-gray-600">Minimize motion effects throughout the app</div>
                        </div>
                        <motion.input
                          type="checkbox"
                          checked={preferences.reduceAnimations}
                          onChange={(e) => handlePreferenceChange('reduceAnimations', e.target.checked)}
                          className="w-6 h-6 text-[#27AE60] focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg scale-125"
                          whileHover={!reducedMotion ? { scale: 1.1 } : {}}
                        />
                      </motion.label>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Enhanced Parent/Guardian Section */}
          <motion.section variants={itemVariants}>
            <Card className="p-10 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-[#6C5CE7]/10 to-[#2B6CB0]/10 rounded-2xl mr-4">
                  <Shield className="w-8 h-8 text-[#6C5CE7]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0F1724]">Parent/Guardian</h2>
                  <p className="text-gray-600 font-medium">Contact information for progress updates</p>
                </div>
              </div>
              
              <div className="max-w-md">
                <label className="block text-xl font-bold text-gray-700 mb-4">Email Address</label>
                <motion.input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all duration-200 bg-white text-[#0F1724] font-semibold text-lg shadow-sm hover:shadow-md"
                  placeholder="parent@example.com"
                  whileHover={!reducedMotion ? { scale: 1.01 } : {}}
                  whileFocus={!reducedMotion ? { scale: 1.01 } : {}}
                />
                <p className="text-sm text-gray-600 mt-4 leading-relaxed">Used for progress summaries and important updates about your child's learning journey.</p>
              </div>
            </Card>
          </motion.section>

          {/* Enhanced Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-6"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleSave}
              className="flex items-center space-x-3 bg-gradient-to-r from-[#27AE60] via-[#27AE60] to-[#22C1C3] text-white px-12 py-5 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 relative overflow-hidden group text-lg"
              whileHover={!reducedMotion ? { scale: 1.02, y: -3 } : {}}
              whileTap={!reducedMotion ? { scale: 0.98 } : {}}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Save className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Save Changes</span>
            </motion.button>
            
            <motion.button
              onClick={handleReset}
              className="flex items-center space-x-3 px-12 py-5 text-gray-700 hover:text-[#0F1724] bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-[#27AE60]/30 rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 shadow-lg hover:shadow-xl text-lg"
              whileHover={!reducedMotion ? { scale: 1.02 } : {}}
              whileTap={!reducedMotion ? { scale: 0.98 } : {}}
            >
              <RotateCcw className="w-6 h-6" />
              <span>Reset to Defaults</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Success Toast */}
        <Toast 
          show={showToast}
          message="🎉 Profile updated successfully!"
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
};

export default ProfilePage;