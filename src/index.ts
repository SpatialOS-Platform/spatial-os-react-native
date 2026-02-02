/**
 * Spatial OS React Native SDK
 * 
 * Complete SDK for integrating Spatial OS into React Native applications.
 */

// Core client
export { SpatialOS, SpatialOSConfig } from './client';

// Context and Provider
export { SpatialOSProvider, useSpatialOS } from './SpatialOSProvider';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useAnchors } from './hooks/useAnchors';
export { useSpaces } from './hooks/useSpaces';
export { useRealtime } from './hooks/useRealtime';

// Types
export type { Anchor, Vector3, Quaternion } from './types/anchor';
export type { Space, SpaceHierarchy } from './types/space';
export type { User, AuthResult } from './types/user';
export type { RealtimeEvent, RealtimeEventType } from './types/realtime';
