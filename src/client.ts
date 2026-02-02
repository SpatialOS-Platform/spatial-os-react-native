import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Anchor } from './types/anchor';
import type { Space, SpaceHierarchy } from './types/space';
import type { User, AuthResult } from './types/user';
import type { RealtimeEvent } from './types/realtime';

export interface SpatialOSConfig {
    baseUrl: string;
    autoRestore?: boolean;
}

type EventCallback = (event: RealtimeEvent) => void;

/**
 * Main Spatial OS client
 */
export class SpatialOS {
    private baseUrl: string;
    private token: string | null = null;
    private ws: WebSocket | null = null;
    private eventListeners: EventCallback[] = [];
    private currentSpaceId: string | null = null;

    constructor(config: SpatialOSConfig) {
        this.baseUrl = config.baseUrl;
        if (config.autoRestore) {
            this.restoreToken();
        }
    }

    // ==================== Auth ====================

    async login(email: string, password: string): Promise<AuthResult> {
        const response = await this.post('/auth/login', { email, password });
        if (response.token) {
            await this.setToken(response.token);
        }
        return response;
    }

    async register(email: string, password: string, displayName?: string): Promise<AuthResult> {
        return this.post('/auth/register', {
            email,
            password,
            display_name: displayName
        });
    }

    async me(): Promise<User> {
        return this.get('/auth/me');
    }

    async logout(): Promise<void> {
        this.token = null;
        await AsyncStorage.removeItem('spatial_os_token');
        this.disconnect();
    }

    isAuthenticated(): boolean {
        return this.token !== null;
    }

    // ==================== Anchors ====================

    async listAnchors(spaceId?: string): Promise<Anchor[]> {
        const path = spaceId ? `/spatial/anchors?space_id=${spaceId}` : '/spatial/anchors';
        const response = await this.get(path);
        return response.anchors || [];
    }

    async getAnchor(anchorId: string): Promise<Anchor> {
        return this.get(`/spatial/anchor/${anchorId}`);
    }

    async createAnchor(data: {
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
    }): Promise<Anchor> {
        return this.post('/spatial/anchor', {
            space_id: data.spaceId,
            type: data.type,
            px: data.px ?? 0,
            py: data.py ?? 0,
            pz: data.pz ?? 0,
            qx: data.qx ?? 0,
            qy: data.qy ?? 0,
            qz: data.qz ?? 0,
            qw: data.qw ?? 1,
            payload: data.payload,
        });
    }

    async updateAnchor(anchorId: string, data: Partial<{
        px: number;
        py: number;
        pz: number;
        qx: number;
        qy: number;
        qz: number;
        qw: number;
        payload: Record<string, unknown>;
    }>): Promise<Anchor> {
        return this.patch(`/spatial/anchor/${anchorId}`, data);
    }

    async deleteAnchor(anchorId: string): Promise<void> {
        await this.delete(`/spatial/anchor/${anchorId}`);
    }

    async nearbyAnchors(lat: number, lon: number, radius?: number): Promise<Anchor[]> {
        let path = `/spatial/nearby?lat=${lat}&lon=${lon}`;
        if (radius) path += `&radius=${radius}`;
        const response = await this.get(path);
        return response.anchors || [];
    }

    // ==================== Spaces ====================

    async listSpaces(): Promise<Space[]> {
        const response = await this.get('/spatial/spaces');
        return response.spaces || [];
    }

    async getSpace(spaceId: string): Promise<Space> {
        return this.get(`/spatial/space/${spaceId}`);
    }

    async createSpace(data: {
        name: string;
        originLat?: number;
        originLon?: number;
        parentSpaceId?: string;
    }): Promise<Space> {
        return this.post('/spatial/space', {
            name: data.name,
            origin_lat: data.originLat,
            origin_lon: data.originLon,
            parent_space_id: data.parentSpaceId,
        });
    }

    async updateSpace(spaceId: string, data: Partial<{
        name: string;
        originLat: number;
        originLon: number;
    }>): Promise<Space> {
        return this.patch(`/spatial/space/${spaceId}`, {
            name: data.name,
            origin_lat: data.originLat,
            origin_lon: data.originLon,
        });
    }

    async deleteSpace(spaceId: string): Promise<void> {
        await this.delete(`/spatial/space/${spaceId}`);
    }

    async getHierarchy(spaceId: string): Promise<SpaceHierarchy> {
        return this.get(`/spatial/hierarchy/${spaceId}`);
    }

    // ==================== Realtime ====================

    connect(spaceId: string): void {
        if (this.ws) {
            this.disconnect();
        }

        const wsUrl = this.baseUrl.replace('http', 'ws');
        this.ws = new WebSocket(`${wsUrl}/realtime/${spaceId}`);
        this.currentSpaceId = spaceId;

        this.ws.onopen = () => {
            if (this.token) {
                this.ws?.send(JSON.stringify({ type: 'auth', token: this.token }));
            }
            this.emit({ type: 'connected', spaceId });
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.emit(data);
            } catch (e) {
                console.error('Failed to parse WebSocket message:', e);
            }
        };

        this.ws.onerror = (error) => {
            this.emit({ type: 'error', message: String(error) });
        };

        this.ws.onclose = () => {
            this.emit({ type: 'disconnected' });
            this.ws = null;
            this.currentSpaceId = null;
        };
    }

    disconnect(): void {
        this.ws?.close();
        this.ws = null;
        this.currentSpaceId = null;
    }

    broadcastPosition(x: number, y: number, z: number): void {
        if (!this.ws) return;
        this.ws.send(JSON.stringify({
            type: 'position_update',
            data: { x, y, z, timestamp: new Date().toISOString() },
        }));
    }

    onEvent(callback: EventCallback): () => void {
        this.eventListeners.push(callback);
        return () => {
            const index = this.eventListeners.indexOf(callback);
            if (index > -1) {
                this.eventListeners.splice(index, 1);
            }
        };
    }

    private emit(event: RealtimeEvent): void {
        this.eventListeners.forEach(cb => cb(event));
    }

    get connectedSpaceId(): string | null {
        return this.currentSpaceId;
    }

    // ==================== HTTP Helpers ====================

    private async get<T>(path: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            headers: this.headers,
        });
        return this.handleResponse(response);
    }

    private async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });
        return this.handleResponse(response);
    }

    private async patch<T>(path: string, body: Record<string, unknown>): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(body),
        });
        return this.handleResponse(response);
    }

    private async delete(path: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'DELETE',
            headers: this.headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }
    }

    private get headers(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        return data;
    }

    private async setToken(token: string): Promise<void> {
        this.token = token;
        await AsyncStorage.setItem('spatial_os_token', token);
    }

    private async restoreToken(): Promise<void> {
        const token = await AsyncStorage.getItem('spatial_os_token');
        if (token) {
            this.token = token;
        }
    }
}
