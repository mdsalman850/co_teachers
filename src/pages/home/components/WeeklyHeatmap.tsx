import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { activityByDay } from '../data/dashboard';
import { useSettings } from '../contexts/SettingsContext';

interface WeeklyHeatmapProps {
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  showAnimation?: boolean;
}

const WeeklyHeatmap: React.FC<WeeklyHeatmapProps> = ({ 
  selectedDate, 
  onDateSelect,
  showAnimation = true 
}) => {
  const { settings } = useSettings();
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const shouldAnimate = showAnimation && !settings.reducedMotion;

  const getIntensityColor = (minutes: number) => {
    if (minutes === 0) return '#E8F3ED';
    if (minutes <= 10) return '#C6E9D2';
    if (minutes <= 25) return '#8FD4AF';
    if (minutes <= 45) return '#54BF8A';
    return '#27AE60';
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get last 70 days (10 weeks)
  const recentActivity = activityByDay.slice(-70);
  
  // Group by weeks
  const weeks = [];
  for (let i = 0; i < recentActivity.length; i += 7) {
    weeks.push(recentActivity.slice(i, i + 7));
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-4">
      <h3 className="font-bold text-[#0F1724] mb-4">Activity Heatmap</h3>
      
      <div className="relative">
        {/* Day labels */}
        <div className="flex mb-2">
          <div className="w-8"></div>
          {dayLabels.map((day, index) => (
            <div key={day} className="flex-1 text-xs text-gray-500 text-center">
              {index % 2 === 0 ? day : ''}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex space-x-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col space-y-1">
              {week.map((day, dayIndex) => (
                <button
                  key={day.date}
                  className={`
                    w-3 h-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-1
                    ${selectedDate === day.date ? 'ring-2 ring-[#0F1724]' : ''}
                    hover:ring-2 hover:ring-[#27AE60]
                  `}
                  style={{ backgroundColor: getIntensityColor(day.minutes) }}
                  onClick={() => onDateSelect?.(day.date)}
                  onMouseEnter={() => setHoveredDate(day.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  onFocus={() => setHoveredDate(day.date)}
                  onBlur={() => setHoveredDate(null)}
                  aria-label={`${formatTooltipDate(day.date)} — ${day.minutes} min`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredDate && (
          <motion.div 
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10"
            initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={shouldAnimate ? { duration: 0.2 } : { duration: 0 }}
            role="tooltip"
            aria-live="polite"
          >
            Great effort! {activityByDay.find(a => a.date === hoveredDate)?.minutes || 0} min on {formatTooltipDate(hoveredDate).split(',')[0]}.
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span className="px-2 py-1 bg-gray-100 rounded-full">Less</span>
        <div className="flex space-x-1">
          {[0, 5, 15, 30, 50].map(minutes => (
            <div
              key={minutes}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getIntensityColor(minutes) }}
            />
          ))}
        </div>
        <span className="px-2 py-1 bg-gray-100 rounded-full">More</span>
      </div>
    </div>
  );
};

export default WeeklyHeatmap;