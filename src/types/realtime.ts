/**
 * Realtime event types for Spatial OS
 */

import type { Anchor } from './anchor';

export type RealtimeEventType =
    | 'connected'
    | 'disconnected'
    | 'error'
    | 'anchor_created'
    | 'anchor_updated'
    | 'anchor_deleted'
    | 'user_joined'
    | 'user_left'
    | 'position_update';

export interface ConnectedEvent {
    type: 'connected';
    spaceId: string;
}

export interface DisconnectedEvent {
    type: 'disconnected';
}

export interface ErrorEvent {
    type: 'error';
    message: string;
}

export interface AnchorCreatedEvent {
    type: 'anchor_created';
    data: Anchor;
}

export interface AnchorUpdatedEvent {
    type: 'anchor_updated';
    data: Anchor;
}

export interface AnchorDeletedEvent {
    type: 'anchor_deleted';
    data: { anchor_id: string };
}

export interface UserJoinedEvent {
    type: 'user_joined';
    user_id: string;
}

export interface UserLeftEvent {
    type: 'user_left';
    user_id: string;
}

export interface PositionUpdateEvent {
    type: 'position_update';
    data: {
        user_id: string;
        x: number;
        y: number;
        z: number;
        timestamp: string;
    };
}

export type RealtimeEvent =
    | ConnectedEvent
    | DisconnectedEvent
    | ErrorEvent
    | AnchorCreatedEvent
    | AnchorUpdatedEvent
    | AnchorDeletedEvent
    | UserJoinedEvent
    | UserLeftEvent
    | PositionUpdateEvent;
