import { ComponentType, memo } from 'react';
import { useEvent } from '../hooks';
import { WithEventsProps, EventSubscriptionProps } from '../types';

const withEvents = <P extends object>(
  Component: ComponentType<P>,
  subscriptions: EventSubscriptionProps[] = []
) => {
  return memo(function WithEvents(props: P & WithEventsProps) {
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