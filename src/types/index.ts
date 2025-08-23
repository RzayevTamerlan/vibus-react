import { EventBus, EventKey, EventHandler, EventBusConfig } from 'vibus-core';

export type EventBusContextType = {
  eventBus: EventBus;
}

export type EventBusHookOptions = {
  eventBus?: EventBus;
}

export type EventSubscriptionProps<T extends Record<string, any> = any> = {
  event: EventKey;
  handler: EventHandler<T>;
  eventBus?: EventBus;
}

export type WithEventsProps = {
  eventBus?: EventBus;
}