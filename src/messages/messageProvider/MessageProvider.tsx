import React, { useEffect, useState } from 'react';
import { MessageContext, MessageType } from './MessageContext';
import { ignoreSource } from './source.ignore';
import { getDefaultSenlerOrigin, isAllowedMessageOrigin } from '@/security/senlerFrame';

const messageBuffer: MessageEvent[] = [];

const bufferMessages = (event: MessageEvent) => {
  if (!isAllowedMessageOrigin(event.origin)) return;
  if (!ignoreSource.includes(event.data.source)) {
    messageBuffer.push(event);
  }
};

window.addEventListener('message', bufferMessages);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<any | null>(null);
  const [parentOrigin, setParentOrigin] = useState(getDefaultSenlerOrigin());

  const sendMessage = (
    message: MessageType,
    target: Window = window,
    origin: string = parentOrigin
  ) => {
    console.log(message)
    target.postMessage(JSON.parse(JSON.stringify(message || '{}')), origin);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isAllowedMessageOrigin(event.origin)) return;
      if (ignoreSource.includes(event.data.source)) return;
      console.log(
        `(in parent) message from ${event.origin} with data: `,
        event.data
      );
      // Origin родителя Senler нужен для ответов в iframe.
      // Origin OAuth-popup (= фронт приложения) в parentOrigin не сохраняем.
      if (event.origin !== window.location.origin) {
        setParentOrigin(event.origin);
      }
      setMessage(event.data);
    };

    while (messageBuffer.length > 0) {
      const bufferedEvent = messageBuffer.shift();
      if (bufferedEvent) {
        handleMessage(bufferedEvent);
      }
    }

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <MessageContext.Provider value={{ message, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
