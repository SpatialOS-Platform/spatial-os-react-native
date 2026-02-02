/**
 * Anchor types for Spatial OS
 */

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
}

export interface Anchor {
    anchor_id: string;
    space_id: string;
    type: string;
    px: number;
    py: number;
    pz: number;
    qx: number;
    qy: number;
    qz: number;
    qw: number;
    payload?: Record<string, unknown>;
    h3_index?: string;
    version?: number;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateAnchorRequest {
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
}

export interface UpdateAnchorRequest {
    px?: number;
    py?: number;
    pz?: number;
    qx?: number;
    qy?: number;
    qz?: number;
    qw?: number;
    payload?: Record<string, unknown>;
}
