import React from 'react';

interface ServerMessageProps {
  message: string;
}

export const ServerMessage: React.FC<ServerMessageProps> = ({ message }) => {
  return (
    <div
      style={{
        maxWidth: '500px',
        padding: '20px',
        border: '1px solid #f56565',
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        margin: '20px auto',
        position: 'relative',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold mb-2">Ошибка</h4>
          <p className="text-sm">{message}</p>
        </div>
        <button
          className="ml-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          style={{ fontSize: '18px', lineHeight: '1' }}
        >
          ×
        </button>
      </div>
    </div>
  );
};


