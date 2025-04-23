// components/ui/Notification.tsx
import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | null;
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function Notification({ type, message, duration = 5000, onClose }: NotificationProps) {
  const [isShowing, setIsShowing] = useState(true);
  
  useEffect(() => {
    if (!type) return;
    
    setIsShowing(true);
    
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [type, message, duration, onClose]);
  
  if (!type) return null;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <FiAlertCircle className="h-5 w-5 text-red-400" />;
      case 'info':
        return <FiInfo className="h-5 w-5 text-blue-400" />;
      default:
        return null;
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-100';
      case 'error':
        return 'bg-red-50 border-red-100';
      case 'info':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };
  
  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };
  
  return (
    <div 
      className={`mb-6 flex items-center justify-between p-4 border rounded-md transition-opacity ${
        isShowing ? 'opacity-100' : 'opacity-0'
      } ${getBackgroundColor()}`}
    >
      <div className="flex items-center">
        {getIcon()}
        <div className={`ml-3 ${getTextColor()}`}>{message}</div>
      </div>
      <button
        type="button"
        onClick={() => {
          setIsShowing(false);
          setTimeout(onClose, 300);
        }}
        className={`${getTextColor()} hover:bg-gray-100 rounded-full p-1`}
      >
        <FiX className="h-5 w-5" />
      </button>
    </div>
  );
}