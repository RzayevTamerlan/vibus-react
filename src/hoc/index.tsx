import React, { ComponentType } from 'react';
import { useEvent } from '../hooks';
import { WithEventsProps, EventSubscriptionProps } from '../types';

// HOC для подписки на события
export const withEvents = <P extends object>(
  Component: ComponentType<P>,
  subscriptions: EventSubscriptionProps[] = []
) => {
  return function WithEvents(props: P & WithEventsProps) {
    // Подписываемся на все переданные события
    subscriptions.forEach(({ event, handler, eventBus }) => {
      useEvent(event, handler, [], { eventBus });
    });

    return <Component {...props} />;
  };
};

// Компонент для подписки на события
export const EventSubscription: React.FC<EventSubscriptionProps> = ({
  event,
  handler,
  eventBus
}) => {
  useEvent(event, handler, [], { eventBus });
  return null;
};