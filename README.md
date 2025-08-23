# Vibus React

React hooks and components for the Vibus event bus library. This package provides a React-friendly API for managing events in React applications with full TypeScript support.

## Features

- ✅ **React Hooks**: Easy-to-use hooks for event management
- ✅ **Context Provider**: Share event bus instances across component tree
- ✅ **Higher-Order Components**: HOC pattern support for class components
- ✅ **Event Namespacing**: Organize events with namespace utilities
- ✅ **Development Tools**: Built-in logging for debugging
- ✅ **Type Safety**: Full TypeScript support with generics
- ✅ **Memory Management**: Automatic cleanup and subscription management

## Installation

```bash
npm install vibus-react vibus-core
# or
yarn add vibus-react vibus-core
```

## Quick Start

```tsx
import React from 'react';
import { EventBusProvider, useEvent, useEmit } from 'vibus-react';

function App() {
  return (
    <EventBusProvider>
      <Publisher />
      <Subscriber />
    </EventBusProvider>
  );
}

function Publisher() {
  const emit = useEmit();
  
  return (
    <button onClick={() => emit('user:click', { timestamp: Date.now() })}>
      Click me!
    </button>
  );
}

function Subscriber() {
  useEvent('user:click', (data) => {
    console.log('Button clicked at:', data.timestamp);
  });
  
  return <div>Listening for clicks...</div>;
}
```

## API Reference

### Provider

#### `<EventBusProvider>`

Provides an event bus instance to the component tree.

```tsx
import { EventBusProvider } from 'vibus-react';
import { createEventBus } from 'vibus-core';

// Using global event bus (default)
<EventBusProvider>
  <App />
</EventBusProvider>

// Using custom configuration
<EventBusProvider config={{ maxListeners: 50 }}>
  <App />
</EventBusProvider>

// Using external event bus instance
const myEventBus = createEventBus();
<EventBusProvider eventBus={myEventBus}>
  <App />
</EventBusProvider>
```

**Props:**
- `children: ReactNode` - Child components
- `eventBus?: EventBus` - External event bus instance (optional)
- `config?: EventBusConfig` - Configuration for new event bus (optional)

### Hooks

#### `useEvent<T>(event, handler, dependencies?, options?)`

Subscribe to an event. Automatically handles cleanup on unmount.

```tsx
import { useEvent } from 'vibus-react';

function MyComponent() {
  useEvent('user:login', (user) => {
    console.log('User logged in:', user.name);
  });

  // With dependencies for handler updates
  const [count, setCount] = useState(0);
  useEvent('increment', () => {
    setCount(c => c + 1);
  }, [setCount]);

  return <div>Count: {count}</div>;
}
```

**Parameters:**
- `event: EventKey` - Event to listen for
- `handler: EventHandler<T>` - Event handler function
- `dependencies?: any[]` - Dependencies for handler updates (default: `[]`)
- `options?: EventBusHookOptions` - Hook options

#### `useEventOnce<T>(event, handler, options?)`

Subscribe to an event that will only trigger once.

```tsx
function WelcomeComponent() {
  useEventOnce('app:ready', () => {
    console.log('App is ready!');
  });

  return <div>Welcome!</div>;
}
```

#### `useEmit(options?)`

Get a function to emit events.

```tsx
function ButtonComponent() {
  const emit = useEmit();
  
  const handleClick = () => {
    emit('button:clicked', { id: 'my-button', timestamp: Date.now() });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

#### `useEventAll(handler, options?)`

Listen to all events (wildcard listener).

```tsx
function DebugComponent() {
  useEventAll((eventKey, payload) => {
    console.log(`Event: ${String(eventKey)}`, payload);
  });

  return <div>Debug listener active</div>;
}
```

#### `useEventBus(config?)`

Create an isolated event bus instance.

```tsx
function IsolatedComponent() {
  const localEventBus = useEventBus({ maxListeners: 10 });
  
  // This component has its own event bus
  const emit = useEmit({ eventBus: localEventBus });
  
  useEvent('local:event', (data) => {
    console.log('Local event:', data);
  }, [], { eventBus: localEventBus });

  return <button onClick={() => emit('local:event', 'test')}>
    Local Event
  </button>;
}
```

#### `useCurrentEventBus()`

Get the current event bus from context.

```tsx
function AdvancedComponent() {
  const eventBus = useCurrentEventBus();
  
  // Direct access to event bus methods
  const handleComplexOperation = () => {
    const allHandlers = eventBus.all();
    console.log('Current handlers:', allHandlers);
  };

  return <button onClick={handleComplexOperation}>Debug</button>;
}
```

### Higher-Order Components

#### `withEvents<P>(Component, subscriptions?)`

HOC that adds event subscriptions to a component.

```tsx
import { withEvents, EventSubscription } from 'vibus-react';

const MyComponent = ({ name }) => <div>Hello {name}</div>;

const subscriptions: EventSubscription[] = [
  {
    event: 'user:login',
    handler: (user) => console.log('User logged in:', user)
  },
  {
    event: 'data:update',
    handler: (data) => console.log('Data updated:', data)
  }
];

export default withEvents(MyComponent, subscriptions);
```

#### `<EventSubscription>`

Declarative component for event subscriptions.

```tsx
import { EventSubscription } from 'vibus-react';

function App() {
  return (
    <div>
      <EventSubscription
        event="user:logout"
        handler={(user) => console.log('User logged out:', user)}
      />
      <MyComponent />
    </div>
  );
}
```

### Utilities

#### `createEventNamespace(namespace, eventBus)`

Create a namespaced event API.

```tsx
import { createEventNamespace } from 'vibus-react';
import { useCurrentEventBus } from 'vibus-react';

function UserComponent() {
  const eventBus = useCurrentEventBus();
  const userEvents = createEventNamespace('user', eventBus);
  
  // userEvents.emit('login', data) -> emits 'user:login'
  // userEvents.on('logout', handler) -> listens to 'user:logout'
  
  const handleLogin = () => {
    userEvents.emit('login', { id: 123, name: 'John' });
  };

  useEffect(() => {
    const unsubscribe = userEvents.on('logout', (user) => {
      console.log('User logged out:', user);
    });
    return unsubscribe;
  }, []);

  return <button onClick={handleLogin}>Login</button>;
}
```

#### `withEventLogger(eventBus, enabled?)`

Add logging to an event bus for debugging.

```tsx
import { withEventLogger, createEventBus } from 'vibus-react';

const eventBus = withEventLogger(
  createEventBus(),
  process.env.NODE_ENV === 'development'
);

function App() {
  return (
    <EventBusProvider eventBus={eventBus}>
      {/* All emitted events will be logged to console */}
      <MyApp />
    </EventBusProvider>
  );
}
```

## Usage Examples

### Basic Communication Between Components

```tsx
import React, { useState } from 'react';
import { EventBusProvider, useEvent, useEmit } from 'vibus-react';

function App() {
  return (
    <EventBusProvider>
      <Counter />
      <Display />
      <Controls />
    </EventBusProvider>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  
  useEvent('counter:increment', () => setCount(c => c + 1));
  useEvent('counter:decrement', () => setCount(c => c - 1));
  useEvent('counter:reset', () => setCount(0));
  
  return <div>Count: {count}</div>;
}

function Display() {
  const [lastAction, setLastAction] = useState('');
  
  useEvent('counter:increment', () => setLastAction('Incremented'));
  useEvent('counter:decrement', () => setLastAction('Decremented'));
  useEvent('counter:reset', () => setLastAction('Reset'));
  
  return <div>Last action: {lastAction}</div>;
}

function Controls() {
  const emit = useEmit();
  
  return (
    <div>
      <button onClick={() => emit('counter:increment')}>+</button>
      <button onClick={() => emit('counter:decrement')}>-</button>
      <button onClick={() => emit('counter:reset')}>Reset</button>
    </div>
  );
}
```

### Type-Safe Events

```tsx
interface UserData {
  id: number;
  name: string;
  email: string;
}

interface NotificationData {
  type: 'success' | 'error' | 'info';
  message: string;
}

function UserProfile() {
  const emit = useEmit();
  
  useEvent<UserData>('user:updated', (userData) => {
    // userData is properly typed as UserData
    console.log('User updated:', userData.name);
  });
  
  const handleSave = () => {
    const userData: UserData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    emit<UserData>('user:updated', userData);
    emit<NotificationData>('notification:show', {
      type: 'success',
      message: 'Profile updated successfully'
    });
  };
  
  return <button onClick={handleSave}>Save Profile</button>;
}
```

### Complex Application Architecture

```tsx
// services/eventTypes.ts
export interface AppEvents {
  'auth:login': { user: User };
  'auth:logout': { userId: string };
  'api:request:start': { url: string };
  'api:request:end': { url: string; status: number };
  'notification:show': NotificationData;
}

// components/AuthProvider.tsx
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const emit = useEmit();
  
  useEvent<AppEvents['auth:login']>('auth:login', ({ user }) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  });
  
  useEvent<AppEvents['auth:logout']>('auth:logout', () => {
    setUser(null);
    localStorage.removeItem('user');
    emit('notification:show', {
      type: 'info',
      message: 'You have been logged out'
    });
  });
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// components/ApiProvider.tsx
function ApiProvider({ children }) {
  const [loading, setLoading] = useState(false);
  
  useEvent('api:request:start', () => setLoading(true));
  useEvent('api:request:end', () => setLoading(false));
  
  return (
    <div>
      {loading && <LoadingSpinner />}
      {children}
    </div>
  );
}

// App.tsx
function App() {
  return (
    <EventBusProvider>
      <AuthProvider>
        <ApiProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Your routes */}
              </Routes>
            </Router>
          </NotificationProvider>
        </ApiProvider>
      </AuthProvider>
    </EventBusProvider>
  );
}
```

### Using Multiple Event Bus Instances

```tsx
function MultiEventBusApp() {
  // Global event bus for app-wide events
  const globalEmit = useEmit();
  
  // Local event bus for component-specific events
  const localEventBus = useEventBus();
  const localEmit = useEmit({ eventBus: localEventBus });
  
  // Listen on global bus
  useEvent('global:event', (data) => {
    console.log('Global event:', data);
  });
  
  // Listen on local bus
  useEvent('local:event', (data) => {
    console.log('Local event:', data);
  }, [], { eventBus: localEventBus });
  
  return (
    <div>
      <button onClick={() => globalEmit('global:event', 'test')}>
        Global Event
      </button>
      <button onClick={() => localEmit('local:event', 'test')}>
        Local Event
      </button>
    </div>
  );
}
```

### Development Debugging

```tsx
import { withEventLogger } from 'vibus-react';

function DebugApp() {
  const eventBus = useEventBus();
  
  // Enable logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      withEventLogger(eventBus, true);
    }
  }, [eventBus]);
  
  // Log all events for debugging
  useEventAll((eventKey, payload) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔈 Event: ${String(eventKey)}`);
      console.log('Payload:', payload);
      console.log('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
  });
  
  return <div>Debug mode active</div>;
}
```

## Best Practices

### 1. Use TypeScript Interfaces

Define clear interfaces for your events to ensure type safety:

```tsx
// types/events.ts
export interface AppEvents {
  'user:login': UserData;
  'user:logout': { userId: string };
  'notification:show': NotificationData;
  'modal:open': { modalId: string; props?: any };
  'modal:close': { modalId: string };
}
```

### 2. Organize Events with Namespaces

Use consistent naming conventions for events:

```tsx
// Good: namespaced events
'user:login'
'user:logout'
'user:profile:update'
'api:request:start'
'api:request:success'
'api:request:error'
'ui:modal:open'
'ui:modal:close'

// Avoid: generic names
'login'
'update'
'error'
```

### 3. Handle Dependencies in useEvent

When your event handler depends on component state, include dependencies:

```tsx
function MyComponent() {
  const [data, setData] = useState([]);
  
  useEvent('data:add', (newItem) => {
    setData(currentData => [...currentData, newItem]);
  }, [setData]); // Include setData in dependencies
  
  return <div>{data.length} items</div>;
}
```

### 4. Use Context Appropriately

Provide EventBus at the appropriate level in your component tree:

```tsx
// App-level for global communication
function App() {
  return (
    <EventBusProvider>
      <Router />
    </EventBusProvider>
  );
}

// Feature-level for isolated features
function ChatFeature() {
  const chatEventBus = useEventBus();
  
  return (
    <EventBusProvider eventBus={chatEventBus}>
      <ChatWindow />
      <ChatInput />
    </EventBusProvider>
  );
}
```

### 5. Clean Event Handlers

Event handlers are automatically cleaned up, but be mindful of what they capture:

```tsx
// Good: minimal closure
useEvent('user:update', useCallback((user) => {
  setUser(user);
}, [setUser]));

// Avoid: capturing unnecessary values
const heavyObject = useMemo(() => createHeavyObject(), []);
useEvent('some:event', () => {
  // This captures heavyObject unnecessarily
  console.log('Event received', heavyObject);
});
```

## Error Handling

Handle errors in event handlers appropriately:

```tsx
function App() {
  const eventBus = useEventBus({
    onError: (error, eventKey, payload) => {
      console.error(`Error in event ${String(eventKey)}:`, error);
      
      // Report to error tracking service
      errorTracker.captureException(error, {
        tags: { eventKey: String(eventKey) },
        extra: { payload }
      });
    }
  });
  
  return (
    <EventBusProvider eventBus={eventBus}>
      <App />
    </EventBusProvider>
  );
}
```

## TypeScript Types

```typescript
import { EventBus, EventKey, EventHandler } from 'vibus-core';

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
```

## License

MIT License