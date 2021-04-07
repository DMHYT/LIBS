/// <reference path="core-engine.d.ts" />
declare namespace PortalUtils {
    type PortalRenderType = "full" | "v-plane" | "h-plane" | "u-plane";
    type RectPlane = "oX" | "oY" | "oZ";
    export interface PortalRenderParams {
        ignoreSelf: boolean;
        frameId: number;
        type: PortalRenderType;
    }
    export interface RawRect {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
        plane: RectPlane;
    }
    export interface Rect extends RawRect {
        width(): number;
        height(): number;
        offset: Vector;
    }
    export interface FullRect extends Rect {
        convert(x: number, y: number, z?: number): Vector;
    }
    export interface PortalBuilder {
        (pos: Vector, region: BlockSource): void;
    }
    export interface PortalTransfer {
        to: number;
        from?: number;
    }
    export const PORTAL_BLOCK_TYPE: number;
    export const RENDER_TYPE_FULL: PortalRenderType;
    export const RENDER_TYPE_VERTICAL_PLANE: PortalRenderType;
    export const RENDER_TYPE_HORIZONTAL_PLANE: PortalRenderType;
    export const RENDER_TYPE_UNIVERSAL_PLANE: PortalRenderType;
    export class PortalBlock {
        private readonly id;
        constructor(id: string, texture: [string, number][] | [string, number], portalRenderParams: PortalRenderParams, dimension: PortalTransfer, debugEnabled: boolean);
        getId(): number;
    }
    export {};
}
declare class PortalShape {
    minWidth: number;
    minHeight: number;
    spaceIds: {
        [key: number]: boolean;
    };
    frameIds: {
        [key: number]: boolean;
    };
    buildIds: {
        portal: number;
        frame: number;
    };
    orientation: {
        vertical: boolean;
        horizontal: boolean;
    };
    setMinSize(w: number, h: number): PortalShape;
    setPortalId(id: number): PortalShape;
    setFrameIds(...ids: number[]): PortalShape;
    setSpaceIds(...ids: number[]): PortalShape;
    setHorizontal(horizontal: boolean): PortalShape;
    isFrameTileAt(x: number, y: number, z: number, region: BlockSource): boolean;
    isSpaceTileAt(x: number, y: number, z: number, region: BlockSource): boolean;
    private _searchForFrameTile;
    private _buildRect;
    private _getPossibleRects;
    private _checkRect;
    private _buildPortalPlane;
    private _buildPortalFrame;
    private _clearArea;
    findPortal(x: number, y: number, z: number, region: BlockSource): PortalUtils.FullRect;
    buildPortal(rect: PortalUtils.FullRect, region: BlockSource, isNewOne: boolean): void;
    getBuilder(): PortalUtils.PortalBuilder;
    makeNormalTransfer(from: number, to: number): PortalShape;
    makeDestroyEvent(): PortalShape;
}
declare namespace DimensionHelper {
    interface PortalSearchingOptions {
        radius: number;
        range: [number, number];
        fast: boolean;
    }
    interface PlayerAdjustOptions {
        frameId: number;
        placePortal: boolean;
        movePlayer: boolean;
    }
    class PortalChecker implements Updatable {
        remove: boolean;
        private validIds;
        private portalId;
        private pos;
        private region;
        private _checkPortal;
        private _checkRecursive;
        private _checkAround;
        update(): void;
        constructor(validIds: {
            [key: number]: boolean;
        }, portalId: number, pos: Vector, region: BlockSource);
    }
    function searchForPortal(pos: Vector, blockId: number, region: BlockSource, options: PortalSearchingOptions): Vector;
    function adjustPlayerInPortal(pos: Vector, blockId: number, region: BlockSource, player: number, options: PlayerAdjustOptions): Vector;
    function eliminateIncorrectPlacedPortals(pos: Vector, portalId: number, frameIds: number[], region: BlockSource): void;
}
