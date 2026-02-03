import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { activityByDay } from '../data/dashboard';
import { useSettings } from '../contexts/SettingsContext';

interface MiniCalendarProps {
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  showAnimation?: boolean;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ 
  selectedDate, 
  onDateSelect,
  showAnimation = true 
}) => {
  const { settings } = useSettings();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const shouldAnimate = showAnimation && !settings.reducedMotion;
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month's leading days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getActivityForDate = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const activity = activityByDay.find(a => a.date === dateStr);
    return activity?.minutes || 0;
  };

  const getActivityDots = (minutes: number) => {
    if (minutes === 0) return [];
    if (minutes <= 10) return [1];
    if (minutes <= 25) return [1, 1];
    return [1, 1, 1];
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toISOString().slice(0, 10) === selectedDate;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    onDateSelect?.(dateStr);
  };

  const handleKeyDown = (e: React.KeyboardEvent, date: Date) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDateClick(date);
    }
  };

  const formatDateForAria = (date: Date) => {
    const minutes = getActivityForDate(date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    return `${dayName} ${dayNum} ${monthName} — ${minutes} min studied`;
  };

  const days = getDaysInMonth(currentMonth);
  const selectedActivity = selectedDate ? activityByDay.find(a => a.date === selectedDate) : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <motion.h3 
          className="font-bold text-[#0F1724]"
          key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
          initial={shouldAnimate ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={shouldAnimate ? { duration: 0.3 } : { duration: 0 }}
        >
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </motion.h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-1 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-1 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((day, index) => {
          const minutes = getActivityForDate(day.date);
          const dots = getActivityDots(minutes);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(day.date)}
              onKeyDown={(e) => handleKeyDown(e, day.date)}
              className={`
                relative h-8 text-xs rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-1
                ${day.isCurrentMonth ? 'text-[#0F1724] hover:bg-gray-100' : 'text-gray-400'}
                ${isToday(day.date) ? 'ring-2 ring-[#27AE60] bg-[#27AE60]/5' : ''}
                ${isSelected(day.date) ? 'bg-[#27AE60] text-white' : ''}
              `}
              aria-label={formatDateForAria(day.date)}
            >
              {day.date.getDate()}
              {dots.length > 0 && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                  {dots.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full ${
                        isSelected(day.date) ? 'bg-white' : 'bg-[#27AE60]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day detail panel */}
      {selectedDate && selectedActivity && (
        <motion.div 
          className="border-t pt-4"
          initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldAnimate ? { duration: 0.3 } : { duration: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#0F1724] text-sm">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-gray-600">
                {selectedActivity.minutes} minutes studied
              </p>
            </div>
            <button className="flex items-center space-x-1 text-xs font-medium text-[#27AE60] hover:text-[#219A52] focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg px-2 py-1">
              <Play className="w-3 h-3" />
              <span>Start practice</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MiniCalendar;