
import React from 'react';
import { XCircleIcon } from './icons';

interface AdminExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: string;
}

export const AdminExportModal: React.FC<AdminExportModalProps> = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    alert('Données copiées dans le presse-papiers !');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-primary">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <pre className="bg-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap break-words">
            {data}
          </pre>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button 
            onClick={handleCopy}
            className="bg-secondary hover:bg-secondary-hover text-white font-bold py-2 px-4 rounded-md transition duration-300">
            Copier
          </button>
        </div>
      </div>
    </div>
  );
};
