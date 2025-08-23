import { EventBus } from 'vibus-core';

export const createEventNamespace = (namespace: string, eventBus: EventBus) => {
  return {
    on: <T = any>(event: string, handler: (payload: T) => void) => 
      eventBus.on(`${namespace}:${event}`, handler),
    off: <T = any>(event: string, handler: (payload: T) => void) => 
      eventBus.off(`${namespace}:${event}`, handler),
    emit: <T = any>(event: string, payload?: T) => 
      eventBus.emit(`${namespace}:${event}`, payload),
    once: <T = any>(event: string, handler: (payload: T) => void) => 
      eventBus.once(`${namespace}:${event}`, handler),
  };
};

export const withEventLogger = (eventBus: EventBus, enabled: boolean = true) => {
  if (!enabled) return eventBus;

  const originalEmit = eventBus.emit.bind(eventBus);
  
  eventBus.emit = (event, payload) => {
    console.log(`🔈 [vibus] Emitting event: ${String(event)}`, payload);
    return originalEmit(event, payload);
  };
  
  return eventBus;
};