import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-400';
      case 'info':
      default:
        return 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-in-right`}>
      <div className={`${getToastStyles()} text-white px-6 py-4 rounded-lg shadow-2xl border-2 backdrop-blur-lg min-w-80`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{getIcon()}</span>
            <p className="font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast; 