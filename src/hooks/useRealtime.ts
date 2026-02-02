import { useState, useEffect, useCallback } from 'react';
import { useSpatialOS } from '../SpatialOSProvider';
import type { RealtimeEvent } from '../types/realtime';

interface RealtimeState {
    isConnected: boolean;
    spaceId: string | null;
    events: RealtimeEvent[];
}

/**
 * Hook for real-time WebSocket operations
 * 
 * @example
 * ```tsx
 * const { connect, disconnect, isConnected, events, broadcastPosition } = useRealtime();
 * 
 * useEffect(() => {
 *   connect('space-123');
 *   return () => disconnect();
 * }, []);
 * ```
 */
export function useRealtime() {
    const client = useSpatialOS();
    const [state, setState] = useState<RealtimeState>({
        isConnected: false,
        spaceId: null,
        events: [],
    });

    useEffect(() => {
        const unsubscribe = client.onEvent((event: RealtimeEvent) => {
            setState((s: RealtimeState) => ({
                ...s,
                events: [...s.events.slice(-99), event], // Keep last 100 events
                isConnected: event.type !== 'disconnected' && (s.isConnected || event.type === 'connected'),
                spaceId: event.type === 'connected' ? event.spaceId :
                    event.type === 'disconnected' ? null : s.spaceId,
            }));
        });

        return unsubscribe;
    }, [client]);

    const connect = useCallback((spaceId: string) => {
        client.connect(spaceId);
    }, [client]);

    const disconnect = useCallback(() => {
        client.disconnect();
    }, [client]);

    const broadcastPosition = useCallback((x: number, y: number, z: number) => {
        client.broadcastPosition(x, y, z);
    }, [client]);

    const clearEvents = useCallback(() => {
        setState((s: RealtimeState) => ({ ...s, events: [] }));
    }, []);

    return {
        ...state,
        connect,
        disconnect,
        broadcastPosition,
        clearEvents,
    };
}
