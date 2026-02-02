import React, { createContext, useContext, useMemo } from 'react';
import { SpatialOS, SpatialOSConfig } from './client';

const SpatialOSContext = createContext<SpatialOS | null>(null);

interface SpatialOSProviderProps extends SpatialOSConfig {
    children: React.ReactNode;
}

/**
 * Provider component for Spatial OS SDK
 * 
 * @example
 * ```tsx
 * <SpatialOSProvider baseUrl="https://your-server.com">
 *   <App />
 * </SpatialOSProvider>
 * ```
 */
export function SpatialOSProvider({
    children,
    baseUrl,
    autoRestore = true,
}: SpatialOSProviderProps) {
    const client = useMemo(() => new SpatialOS({ baseUrl, autoRestore }), [baseUrl, autoRestore]);

    return (
        <SpatialOSContext.Provider value={client}>
            {children}
        </SpatialOSContext.Provider>
    );
}

/**
 * Hook to access the Spatial OS client
 * 
 * @example
 * ```tsx
 * const spatialOS = useSpatialOS();
 * await spatialOS.login('user@example.com', 'password');
 * ```
 */
export function useSpatialOS(): SpatialOS {
    const context = useContext(SpatialOSContext);
    if (!context) {
        throw new Error('useSpatialOS must be used within a SpatialOSProvider');
    }
    return context;
}
