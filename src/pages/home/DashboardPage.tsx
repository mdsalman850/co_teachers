import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Flame, Star, Trophy, Target, Calendar, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subjects, stats, recentActivity, achievements } from './data/dashboard';
import { Card } from './components/Card';
import { StickerIcon } from './components/StickerIcon';
import { GoalRing } from './components/GoalRing';
import { Sparkles } from './components/Sparkles';
import { Toast } from './components/Toast';
import { CountUp } from './lib/CountUp';
import Badge from './components/Badge';
import MiniCalendar from './components/MiniCalendar';
import WeeklyHeatmap from './components/WeeklyHeatmap';
import { useSettings } from './contexts/SettingsContext';
import { useSFX } from './lib/useSFX';
import { useConfetti } from './lib/useConfetti';
import { useReducedMotionSetting } from './lib/useReducedMotionSetting';

const DashboardPage: React.FC = () => {
  const { settings } = useSettings();
  const sfx = useSFX();
  const { burst } = useConfetti();
  const reducedMotion = useReducedMotionSetting();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [checkedTasks, setCheckedTasks] = useState<boolean[]>([false, false, false]);
  const [showToast, setShowToast] = useState(false);
  const [sparkleStats, setSparkleStats] = useState<boolean[]>([false, false, false, false]);

  const todaysPlan = [
    { id: 1, title: 'Complete Math Quiz', duration: '5 min', icon: CheckCircle, color: '#FF6B6B' },
    { id: 2, title: 'Watch Science Video', duration: '8 min', icon: Play, color: '#27AE60' },
    { id: 3, title: 'English Practice', duration: '10 min', icon: BookOpen, color: '#22C1C3' },
  ];

  const handleTaskCheck = (index: number) => {
    const newChecked = [...checkedTasks];
    newChecked[index] = !newChecked[index];
    setCheckedTasks(newChecked);
    
    if (newChecked[index]) {
      sfx.pop();
    }
    
    if (newChecked.every(checked => checked)) {
      burst();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  useEffect(() => {
    if (!reducedMotion) {
      const timers = stats.map((_, index) => 
        setTimeout(() => {
          setSparkleStats(prev => {
            const newSparkles = [...prev];
            newSparkles[index] = true;
            return newSparkles;
          });
          setTimeout(() => {
            setSparkleStats(prev => {
              const newSparkles = [...prev];
              newSparkles[index] = false;
              return newSparkles;
            });
          }, 1000);
        }, 500 + index * 200)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [reducedMotion]);

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
            <div className="flex items-center space-x-8">
              <div>
                <motion.h1 
                  className="text-5xl font-bold text-[#0F1724] mb-3 bg-gradient-to-r from-[#0F1724] via-[#27AE60] to-[#22C1C3] bg-clip-text text-transparent"
                  initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Your Dashboard
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-600 font-medium"
                  initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Track your progress and continue your learning journey
                </motion.p>
              </div>
              <motion.div
                className="hidden lg:block"
                initial={!reducedMotion ? { scale: 0, rotate: -180 } : { scale: 1, rotate: 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 100 }}
                whileHover={!reducedMotion ? { scale: 1.05, rotate: 5 } : {}}
              >
                <GoalRing 
                  progress={settings.dailyGoal ? (35 / settings.dailyGoal) * 100 : 60} 
                  size={80}
                  strokeWidth={6}
                  onClick={() => window.location.hash = '#/settings'}
                />
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.a
                href="#/home"
                className="flex items-center space-x-3 px-8 py-4 text-gray-700 hover:text-[#0F1724] bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-black/5 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 font-semibold"
                whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </motion.a>
              
              <motion.button 
                className="flex items-center space-x-3 bg-gradient-to-r from-[#27AE60] via-[#27AE60] to-[#22C1C3] text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 relative overflow-hidden group"
                whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Play className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Continue Learning</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Enhanced Stats Section */}
          <motion.section variants={itemVariants} aria-labelledby="stats-heading">
            <div className="flex items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-[#27AE60]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0F1724]">Learning Statistics</h2>
                  <p className="text-gray-600 font-medium">Your progress at a glance</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const getIcon = () => {
                  switch (stat.icon) {
                    case 'flame': return <Flame className="w-7 h-7" />;
                    case 'check': return <CheckCircle className="w-7 h-7" />;
                    case 'star': return <Star className="w-7 h-7" />;
                    case 'clock': return <Clock className="w-7 h-7" />;
                    default: return <Trophy className="w-7 h-7" />;
                  }
                };

                return (
                  <Sparkles key={stat.label} trigger={sparkleStats[index]}>
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl ring-1 ring-black/5 p-8 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group cursor-pointer"
                      whileHover={!reducedMotion ? { scale: 1.02, y: -8 } : {}}
                      initial={!reducedMotion ? { opacity: 0, y: 30, scale: 0.9 } : { opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={!reducedMotion ? { duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 100 } : { duration: 0 }}
                    >
                      {/* Gradient Background */}
                      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-[#27AE60]/8 via-[#22C1C3]/5 to-transparent rounded-t-3xl" />
                      
                      {/* Floating Decoration */}
                      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[#27AE60]/10 to-[#22C1C3]/10 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                      
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">{stat.label}</p>
                          <motion.p 
                            className="text-4xl font-bold text-[#0F1724] mb-2"
                            initial={!reducedMotion ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={!reducedMotion ? { duration: 0.8, delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 } : { duration: 0 }}
                          >
                            {typeof stat.value === 'number' ? (
                              <CountUp end={stat.value} duration={1000} />
                            ) : (
                              stat.value
                            )}
                          </motion.p>
                          <p className="text-sm text-gray-500 font-medium">{stat.sub}</p>
                        </div>
                        <motion.div
                          whileHover={!reducedMotion ? { rotate: 10, scale: 1.1 } : {}}
                          transition={{ duration: 0.2 }}
                        >
                          <StickerIcon 
                            icon={getIcon()}
                            accent="#27AE60"
                            size="lg"
                            className="shadow-lg"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  </Sparkles>
                );
              })}
            </div>
          </motion.section>

          {/* Enhanced Subject Progress */}
          <motion.section variants={itemVariants} aria-labelledby="subjects-heading">
            <div className="flex items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-[#FF6B6B]/10 to-[#F59E0B]/10 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-[#FF6B6B]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0F1724]">Subject Progress</h2>
                  <p className="text-gray-600 font-medium">Continue where you left off</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                  whileHover={!reducedMotion ? { scale: 1.02, y: -8 } : {}}
                  initial={!reducedMotion ? { opacity: 0, y: 30, rotateX: 15 } : { opacity: 1, y: 0, rotateX: 0 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={!reducedMotion ? { duration: 0.6, delay: index * 0.1 + 0.2, type: "spring", stiffness: 100 } : { duration: 0 }}
                >
                  {/* Enhanced Accent Header */}
                  <div className="relative">
                    <div 
                      className="h-3 w-full"
                      style={{ 
                        background: `linear-gradient(135deg, ${subject.accent}, ${subject.accent}dd)` 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <motion.div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        style={{ backgroundColor: subject.accent }}
                        whileHover={!reducedMotion ? { rotate: 5, scale: 1.05 } : {}}
                      >
                        {subject.title.charAt(0)}
                      </motion.div>
                      <div className="text-right">
                        <motion.div 
                          className="text-3xl font-bold text-[#0F1724]"
                          initial={!reducedMotion ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={!reducedMotion ? { duration: 0.5, delay: index * 0.1 + 0.8 } : { duration: 0 }}
                        >
                          {subject.progress}%
                        </motion.div>
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Complete</div>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-[#0F1724] text-xl mb-3">{subject.title}</h3>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">{subject.desc}</p>
                    
                    {/* Enhanced Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-4 mb-6 overflow-hidden shadow-inner">
                      <motion.div
                        className="h-4 rounded-full relative overflow-hidden shadow-sm"
                        style={{ backgroundColor: subject.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={!reducedMotion ? { duration: 1.2, delay: index * 0.1 + 0.5, ease: "easeOut" } : { duration: 0 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-8 -skew-x-12"
                          animate={!reducedMotion ? { x: [-32, 200] } : {}}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                        />
                      </motion.div>
                    </div>
                    
                    <motion.button 
                      className="w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-[#0F1724] shadow-sm hover:shadow-md group/btn"
                      whileHover={!reducedMotion ? { scale: 1.02 } : {}}
                      whileTap={!reducedMotion ? { scale: 0.98 } : {}}
                    >
                      <Play className="w-5 h-5 mr-3 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      Continue Learning
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Enhanced Today's Plan */}
          <motion.section variants={itemVariants} aria-labelledby="plan-heading">
            <Card className="p-10 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-[#6C5CE7]/10 to-[#2B6CB0]/10 rounded-2xl">
                    <Target className="w-8 h-8 text-[#6C5CE7]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#0F1724]">Today's Plan</h2>
                    <p className="text-gray-600 font-medium">Complete these tasks to reach your daily goal</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {todaysPlan.map((task, index) => {
                  const Icon = task.icon;
                  const isChecked = checkedTasks[index];
                  
                  return (
                    <motion.div 
                      key={task.id} 
                      className="flex items-center space-x-6 p-6 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 group cursor-pointer"
                      initial={!reducedMotion ? { opacity: 0, x: -30 } : { opacity: 1, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={!reducedMotion ? { duration: 0.5, delay: index * 0.1 } : { duration: 0 }}
                      whileHover={!reducedMotion ? { scale: 1.01, x: 4 } : {}}
                      onClick={() => handleTaskCheck(index)}
                    >
                      <motion.button
                        className={`
                          w-12 h-12 rounded-2xl border-3 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 shadow-lg
                          ${isChecked 
                            ? 'bg-[#27AE60] border-[#27AE60] text-white shadow-xl scale-110' 
                            : 'border-gray-300 hover:border-[#27AE60] hover:bg-[#27AE60]/5 bg-white'
                          }
                        `}
                        whileHover={!reducedMotion ? { scale: 1.1, rotate: 5 } : {}}
                        whileTap={!reducedMotion ? { scale: 0.9 } : {}}
                        aria-label={`${isChecked ? 'Uncheck' : 'Check'} ${task.title}`}
                      >
                        <AnimatePresence>
                          {isChecked && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle className="w-7 h-7" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                      
                      <div className="flex items-center space-x-6 flex-1">
                        <motion.div 
                          className={`p-4 rounded-2xl transition-all duration-300 shadow-md ${
                            isChecked 
                              ? 'bg-[#27AE60]/10 text-[#27AE60] shadow-lg' 
                              : 'bg-white text-gray-600 group-hover:shadow-lg'
                          }`}
                          style={{ backgroundColor: isChecked ? `${task.color}15` : undefined }}
                          whileHover={!reducedMotion ? { rotate: 5, scale: 1.05 } : {}}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                        <div className="flex-1">
                          <p className={`font-bold text-lg transition-all duration-300 ${
                            isChecked ? 'text-gray-500 line-through' : 'text-[#0F1724] group-hover:text-[#27AE60]'
                          }`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">{task.duration}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                          isChecked 
                            ? 'bg-[#27AE60]/10 text-[#27AE60]' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isChecked ? 'Complete!' : task.duration}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.section>

          {/* Enhanced Activity Section */}
          <motion.section variants={itemVariants} aria-labelledby="activity-heading">
            <div className="flex items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-[#22C1C3]/10 to-[#27AE60]/10 rounded-2xl">
                  <Calendar className="w-8 h-8 text-[#22C1C3]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0F1724]">Activity Overview</h2>
                  <p className="text-gray-600 font-medium">Track your learning patterns and achievements</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Calendar & Heatmap */}
              <div className="xl:col-span-2 space-y-8">
                <motion.div
                  whileHover={!reducedMotion ? { scale: 1.01, y: -2 } : {}}
                  transition={{ duration: 0.2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden"
                >
                  <MiniCalendar 
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    showAnimation={!reducedMotion}
                  />
                </motion.div>
                
                <motion.div
                  whileHover={!reducedMotion ? { scale: 1.01, y: -2 } : {}}
                  transition={{ duration: 0.2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden"
                >
                  <WeeklyHeatmap 
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    showAnimation={!reducedMotion}
                  />
                </motion.div>
              </div>

              {/* Right Column - Recent Activity & Achievements */}
              <div className="space-y-8">
                {/* Recent Activity */}
                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl">
                  <h3 className="font-bold text-[#0F1724] mb-6 text-2xl flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-[#27AE60]" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 group cursor-pointer"
                        initial={!reducedMotion ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={!reducedMotion ? { duration: 0.4, delay: index * 0.1 } : { duration: 0 }}
                        whileHover={!reducedMotion ? { scale: 1.02, x: 4 } : {}}
                      >
                        <motion.div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                          style={{ backgroundColor: activity.color }}
                          whileHover={!reducedMotion ? { rotate: 5, scale: 1.05 } : {}}
                        >
                          {activity.subject.charAt(0)}
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-bold text-[#0F1724] text-sm group-hover:text-[#27AE60] transition-colors duration-200">{activity.title}</p>
                          <p className="text-xs text-gray-500 font-medium">{activity.date}</p>
                        </div>
                        <motion.div 
                          className="text-right"
                          whileHover={!reducedMotion ? { scale: 1.05 } : {}}
                        >
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 text-[#27AE60] shadow-sm">
                            +{activity.xp} XP
                          </span>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Achievements */}
                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl">
                  <h3 className="font-bold text-[#0F1724] mb-6 text-2xl flex items-center">
                    <Trophy className="w-6 h-6 mr-3 text-[#F59E0B]" />
                    Achievements
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.name}
                        className="bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 text-center hover:shadow-md transition-all duration-300 group cursor-pointer"
                        initial={!reducedMotion ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={!reducedMotion ? { 
                          duration: 0.4, 
                          delay: index * 0.1,
                          ease: 'easeOut' 
                        } : { duration: 0 }}
                        whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
                      >
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-br from-[#27AE60]/10 to-[#22C1C3]/10 rounded-2xl flex items-center justify-center text-[#27AE60] mx-auto mb-3 shadow-sm group-hover:shadow-md transition-shadow duration-300"
                          whileHover={!reducedMotion ? { rotate: 10, scale: 1.1 } : {}}
                        >
                          <Trophy className="w-6 h-6" />
                        </motion.div>
                        <h4 className="font-bold text-[#0F1724] text-sm mb-1 group-hover:text-[#27AE60] transition-colors duration-200">{achievement.name}</h4>
                        <p className="text-xs text-gray-600">{achievement.caption}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </motion.section>
        </motion.div>

        {/* Toast for plan completion */}
        <Toast 
          show={showToast}
          message="🎉 Amazing work! You've completed today's plan!"
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
};

export default DashboardPage;