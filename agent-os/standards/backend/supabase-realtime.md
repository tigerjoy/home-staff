## Supabase Realtime best practices

- **Channel Creation**: Create channels with descriptive topic names following the pattern `scope:id:entity` (e.g., `room:123:messages`, `user:456:notifications`)
- **Private Channels**: Always use private channels for production (`config: { private: true }`) to ensure proper authorization and security
- **Channel Subscriptions**: Subscribe to channels using `.subscribe()` and always unsubscribe when done to free up resources - use React `useEffect` cleanup or similar patterns
- **Broadcast Messages**: Use `.send()` with `type: 'broadcast'` to send messages between clients - structure payloads clearly and consistently
- **Listening to Events**: Use `.on('broadcast', { event: 'event-name' }, callback)` to listen for specific broadcast events - can use `'*'` to listen to all events
- **Database Changes**: Use `.on('postgres_changes', ...)` to listen to database changes (INSERT, UPDATE, DELETE) - consider migrating to Broadcast for better performance
- **Presence**: Use Presence sparingly for user online/offline status - it has computational overhead, prefer Broadcast for most real-time features
- **Connection State**: Monitor channel connection state using subscription callbacks - handle connection errors and reconnection logic
- **RLS with Realtime**: Set up RLS policies on `realtime.messages` table for Broadcast authorization - policies control who can subscribe to private channels
- **Database Triggers**: Use database triggers with `realtime.send()` or `realtime.broadcast_changes()` to automatically broadcast database changes
- **Error Handling**: Always handle subscription errors and connection failures gracefully - implement retry logic for important subscriptions
- **Cleanup**: Always unsubscribe from channels when components unmount or when no longer needed - prevent memory leaks and unnecessary connections
- **Optimistic Updates**: Use optimistic updates in UI while waiting for Realtime confirmation - improves perceived performance
- **Channel Naming**: Follow consistent naming conventions for channels - use descriptive names that clearly indicate the channel's purpose
- **Payload Structure**: Keep broadcast payloads lean and structured - avoid sending large objects or sensitive data through broadcasts
