import React from 'react';

interface ServerMessageProps {
  message: string;
}

export const ServerMessage: React.FC<ServerMessageProps> = ({ message }) => {
  return (
    <div
      style={{
        maxWidth: '400px',
        maxHeight: '200px', 
        overflowX: 'auto',
        overflowY: 'auto',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        textAlign: 'start'
      }}
    >
      {JSON.stringify(message, null, 2)}
    </div>
  );
};


