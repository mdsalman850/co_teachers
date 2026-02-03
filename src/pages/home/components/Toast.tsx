import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  show, 
  message, 
  type = 'success',
  onClose 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#27AE60]" />;
      default:
        return <CheckCircle className="w-5 h-5 text-[#27AE60]" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-l-4 border-l-[#27AE60]';
      default:
        return 'bg-white border-l-4 border-l-[#27AE60]';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed bottom-4 left-4 ${getBgColor()} rounded-lg shadow-lg ring-1 ring-black/5 p-4 max-w-sm z-50`}
          initial={{ opacity: 0, x: -100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex items-center space-x-3">
            {getIcon()}
            <p className="text-sm font-medium text-[#0F1724] flex-1">{message}</p>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};