import React, { useEffect, useState } from 'react';
import { MessageContext, MessageType } from './MessageContext';
import { ignoreSource } from './source.ignore';

// Глобальный буфер для сообщений
const messageBuffer: MessageEvent[] = [];

// Глобальный обработчик для буферизации сообщений
const bufferMessages = (event: MessageEvent) => {
  if (!ignoreSource.includes(event.data.source)) {
    messageBuffer.push(event);
  }
};

// Устанавливаем глобальный слушатель сразу при загрузке модуля
window.addEventListener('message', bufferMessages);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<any | null>(null);

  // Метод отправки сообщения
  const sendMessage = (
    message: MessageType,
    target: Window = window,
    origin: string = '*'
  ) => {
    target.postMessage(JSON.parse(JSON.stringify(message)), origin);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (ignoreSource.includes(event.data.source)) return;
      console.log(
        `(in parent) message from ${event.origin} with data: `,
        event.data
      );
      setMessage(event.data);
    };

    // Обрабатываем сообщения из буфера
    while (messageBuffer.length > 0) {
      const bufferedEvent = messageBuffer.shift();
      if (bufferedEvent) {
        handleMessage(bufferedEvent);
      }
    }

    // Устанавливаем слушатель для новых сообщений
    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <MessageContext.Provider value={{ message, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
