"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiXCircle,
  FiX
} from "react-icons/fi";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

export default function Notification({
  type = "info",
  message,
  description,
  duration = 5000,
  onClose,
  position = "top-right",
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300); // Give time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300); // Give time for exit animation
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="h-6 w-6 text-green-500" />;
      case "error":
        return <FiXCircle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <FiAlertCircle className="h-6 w-6 text-yellow-500" />;
      case "info":
      default:
        return <FiInfo className="h-6 w-6 text-blue-500" />;
    }
  };

  // Get background color based on notification type
  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-yellow-50";
      case "info":
      default:
        return "bg-blue-50";
    }
  };

  // Get border color based on notification type
  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-green-200";
      case "error":
        return "border-red-200";
      case "warning":
        return "border-yellow-200";
      case "info":
      default:
        return "border-blue-200";
    }
  };

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case "top-right":
      default:
        return "top-4 right-4";
    }
  };

  // Progress bar animation
  const progressAnimation = {
    initial: { width: "100%" },
    animate: { width: "0%" },
    transition: { duration: duration / 1000, ease: "linear" },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${getPositionClasses()} z-50 w-full max-w-sm`}
        >
          <div
            className={`shadow-lg rounded-lg border overflow-hidden ${getBgColor()} ${getBorderColor()}`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getIcon()}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">{message}</p>
                  {description && (
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <motion.div
              className="h-1 bg-gray-300 bg-opacity-50"
              {...progressAnimation}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Notification container to manage multiple notifications
interface NotificationContainerProps {
  notifications: {
    id: string;
    type: NotificationType;
    message: string;
    description?: string;
  }[];
  onClose: (id: string) => void;
  position?: NotificationProps["position"];
}

export function NotificationContainer({
  notifications,
  onClose,
  position = "top-right"
}: NotificationContainerProps) {
  return (
    <>
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          description={notification.description}
          position={position}
          duration={5000 + index * 500} // Stagger duration to avoid all closing at the same time
          onClose={() => onClose(notification.id)}
        />
      ))}
    </>
  );
}
