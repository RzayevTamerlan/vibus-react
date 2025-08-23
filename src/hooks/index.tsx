import { useCallback, useEffect, useRef, useMemo } from 'react';
import { EventBus, EventKey, EventHandler, createEventBus, EventBusConfig } from 'vibus-core';
import { EventBusHookOptions } from '../types';
import { useEventBusContext } from '../context';

// Вспомогательная функция для получения event bus
const useEventBusInstance = (options?: EventBusHookOptions): EventBus => {
  try {
    // Пытаемся использовать контекст
    const context = useEventBusContext();
    return options?.eventBus || context.eventBus;
  } catch {
    // Если контекста нет, используем переданный или создаем новый
    return options?.eventBus || createEventBus();
  }
};

// Хук для подписки на события
export const useEvent = <T = any>(
  event: EventKey,
  handler: EventHandler<T>,
  dependencies: any[] = [],
  options?: EventBusHookOptions
) => {
  const eventBus = useEventBusInstance(options);
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler, ...dependencies]);

  useEffect(() => {
    const wrappedHandler = (payload: T) => handlerRef.current(payload);
    const unsubscribe = eventBus.on(event, wrappedHandler);
    
    return unsubscribe;
  }, [event, eventBus]);
};

// Хук для однократной подписки
export const useEventOnce = <T = any>(
  event: EventKey,
  handler: EventHandler<T>,
  options?: EventBusHookOptions
) => {
  const eventBus = useEventBusInstance(options);

  useEffect(() => {
    const unsubscribe = eventBus.once(event, handler);
    return unsubscribe;
  }, [event, handler, eventBus]);
};

// Хук для отправки событий
export const useEmit = (options?: EventBusHookOptions) => {
  const eventBus = useEventBusInstance(options);
  
  return useCallback(<T = any>(event: EventKey, payload?: T) => {
    eventBus.emit(event, payload);
  }, [eventBus]);
};

// Хук для подписки на все события
export const useEventAll = (
  handler: (event: EventKey, payload?: any) => void,
  options?: EventBusHookOptions
) => {
  const eventBus = useEventBusInstance(options);

  useEffect(() => {
    const unsubscribe = eventBus.onAll(handler);
    return unsubscribe;
  }, [handler, eventBus]);
};

// Хук для создания изолированного event bus
export const useEventBus = (config?: EventBusConfig) => {
  return useMemo(() => createEventBus(config), [config]);
};

// Хук для доступа к текущему event bus
export const useCurrentEventBus = () => {
  return useEventBusContext().eventBus;
};