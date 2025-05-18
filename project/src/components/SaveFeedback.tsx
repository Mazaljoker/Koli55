import React from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

interface SaveFeedbackProps {
  status: 'success' | 'error' | 'saving' | null;
  message?: string;
  onClose: () => void;
}

const SaveFeedback: React.FC<SaveFeedbackProps> = ({ status, message, onClose }) => {
  if (!status) return null;

  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200'
    },
    saving: {
      icon: Loader,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`fixed bottom-4 right-4 ${config.bgColor} ${config.textColor} p-4 rounded-lg border ${config.borderColor} shadow-lg max-w-md`}>
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${status === 'saving' ? 'animate-spin' : ''}`} />
        <span>{message}</span>
        {status !== 'saving' && (
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SaveFeedback;