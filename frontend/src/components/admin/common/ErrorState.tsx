// components/admin/common/ErrorState.tsx
import { FiAlertCircle } from "react-icons/fi";

interface ErrorStateProps {
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const ErrorState = ({
  message,
  buttonText,
  onButtonClick,
}: ErrorStateProps) => {
  return (
    <div className="text-center py-8 bg-white rounded-lg shadow-sm">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
        <FiAlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Error Loading Data
      </h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
