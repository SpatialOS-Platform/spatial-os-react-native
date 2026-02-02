import { useState, useCallback, useEffect } from 'react';
import { useSpatialOS } from '../SpatialOSProvider';
import type { Space, SpaceHierarchy } from '../types/space';

interface SpacesState {
    spaces: Space[];
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook for space operations
 * 
 * @example
 * ```tsx
 * const { spaces, createSpace, getHierarchy } = useSpaces();
 * 
 * const handleCreate = async () => {
 *   await createSpace({ name: 'Conference Room' });
 * };
 * ```
 */
export function useSpaces() {
    const client = useSpatialOS();
    const [state, setState] = useState<SpacesState>({
        spaces: [],
        isLoading: false,
        error: null,
    });

    const fetch = useCallback(async () => {
        setState(s => ({ ...s, isLoading: true, error: null }));
        try {
            const spaces = await client.listSpaces();
            setState({ spaces, isLoading: false, error: null });
        } catch (e) {
            const error = e instanceof Error ? e.message : 'Failed to fetch spaces';
            setState(s => ({ ...s, isLoading: false, error }));
        }
    }, [client]);

    useEffect(() => {
        if (client.isAuthenticated()) {
            fetch();
        }
    }, [fetch, client]);

    const createSpace = useCallback(async (data: {
        name: string;
        originLat?: number;
        originLon?: number;
        parentSpaceId?: string;
    }) => {
        const space = await client.createSpace(data);
        setState(s => ({ ...s, spaces: [...s.spaces, space] }));
        return space;
    }, [client]);

    const updateSpace = useCallback(async (
        spaceId: string,
        data: Partial<{ name: string; originLat: number; originLon: number }>
    ) => {
        const updated = await client.updateSpace(spaceId, data);
        setState(s => ({
            ...s,
            spaces: s.spaces.map(sp => sp.space_id === spaceId ? updated : sp),
        }));
        return updated;
    }, [client]);

    const deleteSpace = useCallback(async (spaceId: string) => {
        await client.deleteSpace(spaceId);
        setState(s => ({
            ...s,
            spaces: s.spaces.filter(sp => sp.space_id !== spaceId),
        }));
    }, [client]);

    const getHierarchy = useCallback(async (spaceId: string): Promise<SpaceHierarchy> => {
        return client.getHierarchy(spaceId);
    }, [client]);

    return {
        ...state,
        refresh: fetch,
        createSpace,
        updateSpace,
        deleteSpace,
        getHierarchy,
    };
}
