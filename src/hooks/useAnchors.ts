import { useState, useCallback, useEffect } from 'react';
import { useSpatialOS } from '../SpatialOSProvider';
import type { Anchor } from '../types/anchor';

interface AnchorsState {
    anchors: Anchor[];
    isLoading: boolean;
    error: string | null;
}

interface UseAnchorsOptions {
    spaceId?: string;
    autoFetch?: boolean;
}

/**
 * Hook for anchor operations
 * 
 * @example
 * ```tsx
 * const { anchors, createAnchor, refresh } = useAnchors({ spaceId: 'space-123' });
 * 
 * const handleCreate = async () => {
 *   await createAnchor({
 *     spaceId: 'space-123',
 *     type: 'QR',
 *     px: 1.0, py: 0.0, pz: 2.0
 *   });
 * };
 * ```
 */
export function useAnchors(options: UseAnchorsOptions = {}) {
    const { spaceId, autoFetch = true } = options;
    const client = useSpatialOS();
    const [state, setState] = useState<AnchorsState>({
        anchors: [],
        isLoading: false,
        error: null,
    });

    const fetch = useCallback(async () => {
        setState((s: AnchorsState) => ({ ...s, isLoading: true, error: null }));
        try {
            const anchors = await client.listAnchors(spaceId);
            setState({ anchors, isLoading: false, error: null });
        } catch (e) {
            const error = e instanceof Error ? e.message : 'Failed to fetch anchors';
            setState((s: AnchorsState) => ({ ...s, isLoading: false, error }));
        }
    }, [client, spaceId]);

    useEffect(() => {
        if (autoFetch && client.isAuthenticated()) {
            fetch();
        }
    }, [autoFetch, fetch, client]);

    const createAnchor = useCallback(async (data: {
        spaceId: string;
        type: string;
        px?: number;
        py?: number;
        pz?: number;
        qx?: number;
        qy?: number;
        qz?: number;
        qw?: number;
        payload?: Record<string, unknown>;
    }) => {
        const anchor = await client.createAnchor(data);
        setState((s: AnchorsState) => ({ ...s, anchors: [...s.anchors, anchor] }));
        return anchor;
    }, [client]);

    const updateAnchor = useCallback(async (
        anchorId: string,
        data: Partial<{
            px: number;
            py: number;
            pz: number;
            payload: Record<string, unknown>;
        }>
    ) => {
        const updated = await client.updateAnchor(anchorId, data);
        setState((s: AnchorsState) => ({
            ...s,
            anchors: s.anchors.map((a: Anchor) => a.anchor_id === anchorId ? updated : a),
        }));
        return updated;
    }, [client]);

    const deleteAnchor = useCallback(async (anchorId: string) => {
        await client.deleteAnchor(anchorId);
        setState((s: AnchorsState) => ({
            ...s,
            anchors: s.anchors.filter((a: Anchor) => a.anchor_id !== anchorId),
        }));
    }, [client]);

    const findNearby = useCallback(async (lat: number, lon: number, radius?: number) => {
        return client.nearbyAnchors(lat, lon, radius);
    }, [client]);

    return {
        ...state,
        refresh: fetch,
        createAnchor,
        updateAnchor,
        deleteAnchor,
        findNearby,
    };
}
