/**
 * Space types for Spatial OS
 */

export interface Space {
    space_id: string;
    name: string;
    owner_id?: string;
    parent_space_id?: string;
    h3_index?: string;
    origin_lat?: number;
    origin_lon?: number;
    created_at?: string;
    updated_at?: string;
}

export interface SpaceHierarchy {
    space: Space;
    children: Space[];
    anchor_count: number;
}

export interface CreateSpaceRequest {
    name: string;
    originLat?: number;
    originLon?: number;
    parentSpaceId?: string;
}

export interface UpdateSpaceRequest {
    name?: string;
    originLat?: number;
    originLon?: number;
}
