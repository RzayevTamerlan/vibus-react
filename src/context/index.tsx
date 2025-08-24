import { createContext, useContext, useMemo, ReactNode, memo } from 'react';
import { EventBus, EventBusConfig, createEventBus, eventBus as globalEventBus } from 'vibus-core';
import { EventBusContextType } from '../types';

const EventBusContext = createContext<EventBusContextType | null>(null);

interface EventBusProviderProps {
  children: ReactNode;
  eventBus?: EventBus;
  config?: EventBusConfig;
}

const EventBusProvider: React.FC<EventBusProviderProps> = ({ 
  children, 
  eventBus: externalEventBus,
  config 
}) => {
  const eventBus = useMemo(() => {
    return externalEventBus ? externalEventBus : config ? createEventBus(config) : globalEventBus;
  }, [externalEventBus, config, globalEventBus]);

  const contextValue = useMemo(() => ({ eventBus }), [eventBus]);

  return (
    <EventBusContext.Provider value={contextValue}>
      {children}
    </EventBusContext.Provider>
  );
};

const MemoizedEventBusProvider = memo(EventBusProvider);

const useEventBusContext = () => {
  const context = useContext(EventBusContext);
  
  if (!context) {
    throw new Error('useEventBusContext must be used within an EventBusProvider');
  }
  
  return context;
};

export {
  MemoizedEventBusProvider as EventBusProvider,
  useEventBusContext
}