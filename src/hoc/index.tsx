import { ComponentType, memo } from 'react';
import { useEvent } from '../hooks';
import { WithEventsProps, EventSubscriptionProps } from '../types';

// HOC для подписки на события
const withEvents = <P extends object>(
  Component: ComponentType<P>,
  subscriptions: EventSubscriptionProps[] = []
) => {
  return memo(function WithEvents(props: P & WithEventsProps) {
    // Подписываемся на все переданные события
    subscriptions.forEach(({ event, handler, eventBus }) => {
      useEvent(event, handler, [], { eventBus });
    });

    return <Component {...props} />;
  });
};

const EventSubscription: React.FC<EventSubscriptionProps> = ({
  event,
  handler,
  eventBus
}) => {
  useEvent(event, handler, [], { eventBus });
  return null;
};

const MemoizedEventSubscription = memo(EventSubscription);

export {
  withEvents,
  MemoizedEventSubscription as EventSubscription
}