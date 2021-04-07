/// <reference path="../../declarations/core-engine.d.ts" />

/*
██████╗  █████╗ ██████╗ ████████╗ █████╗ ██╗       ██╗   ██╗████████╗██╗██╗      ██████╗
██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║       ██║   ██║╚══██╔══╝██║██║     ██╔════╝
██████╔╝██║  ██║██████╔╝   ██║   ███████║██║       ██║   ██║   ██║   ██║██║     ╚█████╗ 
██╔═══╝ ██║  ██║██╔══██╗   ██║   ██╔══██║██║       ██║   ██║   ██║   ██║██║      ╚═══██╗
██║     ╚█████╔╝██║  ██║   ██║   ██║  ██║███████╗  ╚██████╔╝   ██║   ██║███████╗██████╔╝
╚═╝      ╚════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═════╝    ╚═╝   ╚═╝╚══════╝╚═════╝ 
*/

// Firstly created by zheka2304
// Used by DansZbar2
// TypeScript rewrite and multiplayer support by DMHYT / vsdum

LIBRARY({
    name: "PortalUtils",
    version: 7,
    shared: false,
    api: 'CoreEngine'
});

namespace PortalUtils {

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
        plane: RectPlane
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

    // export class TransferUpdatable implements Updatable {

    //     public remove: boolean;
    //     private dimension: number;
    //     private entity: number;
    //     private x: number;
    //     private y: number;
    //     private z: number;
    //     private alterDim: number;
    //     public timer: number = 0;

    //     constructor(dimension: number, entity: number, x: number, y: number, z: number, alterDim: number){
    //         this.dimension = dimension;
    //         this.entity = entity;
    //         this.x = x;
    //         this.y = y;
    //         this.z = z;
    //         this.alterDim = alterDim;
    //     }

    //     update(){
    //         if(this.timer == 80){
    //             if(Entity.getDimension(this.entity) !== this.dimension){
    //                 Dimensions.transfer(this.entity, this.dimension);
    //             } else Dimensions.transfer(this.entity, this.alterDim);
    //             this.remove = true;
    //         } else {
    //             let pos: Vector = Entity.getPosition(this.entity);
    //             if(Math.abs(pos.x - this.x) >= 0.7 || Math.abs(pos.y - this.y) >= 1 || Math.abs(pos.z - this.z) >= 0.7) this.remove = true;
    //             else this.timer++;
    //         }
    //     }

    // }

    export const PORTAL_BLOCK_TYPE: number = Block.createSpecialType({
        name: "customportal",
        base: 90,
        lightlevel: 15,
        rendertype: 0,
        renderlayer: 1,
        explosionres: 9999
    });

    export const RENDER_TYPE_FULL: PortalRenderType = "full";
    export const RENDER_TYPE_VERTICAL_PLANE: PortalRenderType = "v-plane";
    export const RENDER_TYPE_HORIZONTAL_PLANE: PortalRenderType = "h-plane";
    export const RENDER_TYPE_UNIVERSAL_PLANE: PortalRenderType = "u-plane";

    function setupPortalBlock(id: number, texture: [string, number][], portalRenderParams: PortalRenderParams): void {
        let render = new ICRender.Model();
        let group = ICRender.getGroup(`custom_portal_block_${id}`);
        if(!portalRenderParams.ignoreSelf) group.add(id, -1);
        if(portalRenderParams.frameId) group.add(portalRenderParams.frameId, -1);
        if(portalRenderParams.type == "full") render.addEntry(BlockRenderer.createTexturedBlock(texture));
        else if(portalRenderParams.type == "h-plane") render.addEntry(BlockRenderer.createTexturedBox(0, .375, 0, 1, 625, 1, texture));
        else if(portalRenderParams.type == "v-plane"){
            let xAxis: BlockRenderer.Model = BlockRenderer.createTexturedBox(0, 0, .375, 1, 1, .625, texture);
            let zAxis: BlockRenderer.Model = BlockRenderer.createTexturedBox(.375, 0, 0, .625, 1, 1, texture);
            render.addEntry(xAxis).setCondition(ICRender.NOT(
                ICRender.OR(
                    ICRender.BLOCK(0, 0, 1, group, false),
                    ICRender.BLOCK(0, 0, -1, group, false)
                )
            ));
            render.addEntry(zAxis).setCondition(ICRender.OR(
                ICRender.BLOCK(0, 0, 1, group, false),
                ICRender.BLOCK(0, 0, -1, group, false)
            ));
        } else if(portalRenderParams.type == "u-plane"){
            let xAxis: BlockRenderer.Model = BlockRenderer.createTexturedBox(0, 0, .375, 1, 1, .625, texture);
            let yAxis: BlockRenderer.Model = BlockRenderer.createTexturedBox(0, .375, 0, 1, .625, 1, texture);
            let zAxis: BlockRenderer.Model = BlockRenderer.createTexturedBox(.375, 0, 0, .625, 1, 1, texture);
            render.addEntry(xAxis).setCondition(ICRender.NOT(
                ICRender.OR(
                    ICRender.BLOCK(0, 0, 1, group, false),
                    ICRender.BLOCK(0, 0, -1, group, false)
                )
            ));
            render.addEntry(zAxis).setCondition(ICRender.AND(
                ICRender.OR(
                    ICRender.BLOCK(0, 0, 1, group, false),
                    ICRender.BLOCK(0, 0, -1, group, false)
                ),
                ICRender.NOT(
                    ICRender.AND(
                        ICRender.BLOCK(1, 0, 0, group, false),
                        ICRender.BLOCK(-1, 0, 0, group, false),
                        ICRender.BLOCK(0, 0, 1, group, false),
                        ICRender.BLOCK(0, 0, -1, group, false)
                    )
                )
            ));
            render.addEntry(yAxis).setCondition(ICRender.AND(
                ICRender.BLOCK(1, 0, 0, group, false),
                ICRender.BLOCK(-1, 0, 0, group, false),
                ICRender.BLOCK(0, 0, 1, group, false),
                ICRender.BLOCK(0, 0, -1, group, false)
            ));
        } else return Logger.Log(`invalid portal block render type: ${portalRenderParams.type}`, "PortalUtils ERROR");
        BlockRenderer.setStaticICRender(id, -1, render);
    }

    // function addTransferUpdatable(dimension: number, entity: number, x: number, y: number, z: number, alterDim: number): void {
    //     Updatable.addUpdatable(new TransferUpdatable(dimension, entity, x, y, z, alterDim));
    // }

    export class PortalBlock {

        private readonly id: number;
        
        constructor(id: string, texture: [string, number][] | [string, number], portalRenderParams: PortalRenderParams, dimension: PortalTransfer, debugEnabled: boolean){
            this.id = IDRegistry.genBlockID(id);
            if(texture && typeof texture[0] === "string") texture = [texture] as [string, number][];
            Block.createBlock(id, [
                {name: `tile.portal.${this.id}`, texture: texture as [string, number][], inCreative: debugEnabled}
            ], "customportal");
            BlockRenderer.setCustomCollisionShape(this.id, -1, new ICRender.CollisionShape());
            Block.setDestroyTime(this.id, -1);
            if(portalRenderParams) setupPortalBlock(this.id, texture as [string, number][], portalRenderParams);
            if(!dimension.from) dimension.from = 0;
            // let addUpd = addTransferUpdatable;
            Block.registerEntityInsideFunctionForID(this.id, function(coords, block, entity){
                // addTransferUpdatable(dimension.to, entity, coords.x, coords.y, coords.z, dimension.from);
                if(Entity.getDimension(entity) != dimension.to){
                    Dimensions.transfer(entity, dimension.to);
                } else Dimensions.transfer(entity, dimension.from);
            });
        }

        public getId(): number { return this.id; }

    }

}

class PortalShape {

    public minWidth: number;
    public minHeight: number;
    public spaceIds: {[key: number]: boolean} = {0: true};
    public frameIds: {[key: number]: boolean} = {};
    public buildIds: {portal: number, frame: number} = {
        portal: -1,
        frame: -1
    }
    public orientation: {vertical: boolean, horizontal: boolean} = {
        vertical: true,
        horizontal: true
    }

    public setMinSize(w: number, h: number): PortalShape {
        this.minWidth = w;
        this.minHeight = h;
        return this;
    }

    public setPortalId(id: number): PortalShape {
        this.buildIds.portal = id;
        this.spaceIds[id] = true;
        return this;
    }

    public setFrameIds(...ids: number[]): PortalShape {
        this.frameIds = {};
        this.buildIds.frame = ids[0];
        for(let id of ids){
            this.frameIds[id] = true; 
        }
        return this;
    }

    public setSpaceIds(...ids: number[]): PortalShape {
        this.spaceIds = {0: true};
        for(let id of ids){
            this.spaceIds[id] = true;
        }
        return this;
    }

    public setHorizontal(horizontal: boolean): PortalShape {
        this.orientation.horizontal = horizontal;
        return this;
    }

    public isFrameTileAt(x: number, y: number, z: number, region: BlockSource): boolean {
        return this.frameIds[region.getBlockId(x, y, z)];
    }

    public isSpaceTileAt(x: number, y: number, z: number, region: BlockSource): boolean {
        return this.spaceIds[region.getBlockId(x, y, z)];
    }

    private _searchForFrameTile(x: number, y: number, z: number, ax: number, ay: number, az: number, region: BlockSource): number {
        let len: number = 0;
        while(!this.isFrameTileAt(x, y, z, region)){
            x += ax, y += ay, z += az, len++;
            if(len > 16) return -1;
        }
        return len;
    }

    private _buildRect(pos: Vector, raw: PortalUtils.RawRect): PortalUtils.FullRect {
        if(raw.minX != -1 && raw.minY != -1 && raw.maxX != -1 && raw.maxY != -1){
            let rect: PortalUtils.Rect = {
                minX: -raw.minX,
                maxX: raw.maxX + 1,
                minY: -raw.minY,
                maxY: raw.maxY + 1,
                plane: raw.plane,
                width(): number {
                    return this.maxX - this.minX;
                },
                height(): number {
                    return this.maxY - this.minY;
                },
                offset: pos
            }
            switch(rect.plane){
                case "oX":
                    (rect as PortalUtils.FullRect).convert = function(x: number, y: number, z?: number): Vector {
                        return {
                            x: this.offset.x + (z || 0),
                            y: this.offset.y + y,
                            z: this.offset.z + x
                        }
                    }; break;
                case "oY":
                    (rect as PortalUtils.FullRect).convert = function(x: number, y: number, z?: number): Vector {
                        return {
                            x: this.offset.x + x,
                            y: this.offset.y + (z || 0),
                            z: this.offset.z + y
                        }
                    }; break;
                case "oZ":
                    (rect as PortalUtils.FullRect).convert = function(x: number, y: number, z?: number): Vector {
                        return {
                            x: this.offset.x + x,
                            y: this.offset.y + y,
                            z: this.offset.z + (z || 0)
                        }
                    }; break;
                default: return;
            }
            return rect as PortalUtils.FullRect;
        }
    }

    private _getPossibleRects(x: number, y: number, z: number, region: BlockSource): PortalUtils.FullRect[] {
        let distances: {[key: string]: number} = {
            left: this._searchForFrameTile(x, y, z, -1, 0, 0, region),
            right: this._searchForFrameTile(x, y, z, 1, 0, 0, region),
            down: this._searchForFrameTile(x, y, z, 0, -1, 0, region),
            up: this._searchForFrameTile(x, y, z, 0, 1, 0, region),
            back: this._searchForFrameTile(x, y, z, 0, 0, -1, region),
            forward: this._searchForFrameTile(x, y, z, 0, 0, 1, region),
        }
        let rawRects: PortalUtils.RawRect[] = [];
        if(this.orientation.horizontal){
            rawRects.push({
                minX: distances.left,
                maxX: distances.right,
                minY: distances.back,
                maxY: distances.forward,
                plane: "oY"
            });
        }
        if(this.orientation.vertical){
            rawRects.push({
                minX: distances.back,
                maxX: distances.forward,
                minY: distances.down,
                maxY: distances.up,
                plane: "oX"
            });
            rawRects.push({
                minX: distances.left,
                maxX: distances.right,
                minY: distances.down,
                maxY: distances.up,
                plane: "oZ"
            });
        }
        let rects: PortalUtils.FullRect[] = [];
        for(let raw of rawRects){
            let rect: PortalUtils.FullRect = this._buildRect({x: x, y: y, z: z}, raw);
            if(rect && rect.width() - 1 >= this.minWidth && rect.height() - 2 >= this.minHeight){
                rects.push(rect);
            }
        }
        return rects;
    }

    private _checkRect(rect: PortalUtils.FullRect, region: BlockSource): boolean {
        for(let x = rect.minX + 1; x < rect.maxX - 1; x++){
            let pos1: Vector = rect.convert(x, rect.minY);
            let pos2: Vector = rect.convert(x, rect.maxY - 1);
            if (!this.isFrameTileAt(pos1.x, pos1.y, pos1.z, region) || !this.isFrameTileAt(pos2.x, pos2.y, pos2.z, region)) return false;
        }
        for(let y = rect.minY + 1; y < rect.maxY - 1; y++){
            let pos1: Vector = rect.convert(rect.minX, y);
            let pos2: Vector = rect.convert(rect.maxX - 1, y);
            if (!this.isFrameTileAt(pos1.x, pos1.y, pos1.z, region) || !this.isFrameTileAt(pos2.x, pos2.y, pos2.z, region)) return false;
        }
        for(let x = rect.minX + 1; x < rect.maxX - 1; x++){
            for(let y = rect.minY + 1; y < rect.maxY - 1; y++){
                let pos: Vector = rect.convert(x, y);
                if(!this.isSpaceTileAt(pos.x, pos.y, pos.z, region)) return false;
            }
        }
        return true;
    }

    private _buildPortalPlane(rect: PortalUtils.FullRect, region: BlockSource): void {
        for(let x = rect.minX + 1; x < rect.maxX - 1; x++){
            for(let y = rect.minY + 1; y < rect.maxY - 1; y++){
                let pos: Vector = rect.convert(x, y);
                region.setBlock(pos.x, pos.y, pos.z, this.buildIds.portal, 0);
            }
        }
    }

    private _buildPortalFrame(rect: PortalUtils.FullRect, region: BlockSource): void {
        for(let x = rect.minX; x < rect.maxX; x++){
            let pos: Vector = rect.convert(x, rect.minY);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
            pos = rect.convert(x, rect.maxY - 1);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
            pos = rect.convert(x, rect.minY, -1);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
            pos = rect.convert(x, rect.minY, 1);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
        }
        for(let y = rect.minY; y < rect.maxY; y++){
            let pos: Vector = rect.convert(rect.minX, y);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
            pos = rect.convert(rect.maxX - 1, y);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
        }
    }

    private _clearArea(rect: PortalUtils.FullRect, region: BlockSource): void {
        for(let z = -2; z <= 2; z++){
            for(let x = rect.minX; x < rect.maxX; x++){
                for(let y = rect.minY + 1; y < rect.maxY; y++){
                    let pos: Vector = rect.convert(x, y, z);
                    region.setBlock(pos.x, pos.y, pos.z, 0, 0);
                }
            }
        }
    }

    public findPortal(x: number, y: number, z: number, region: BlockSource): PortalUtils.FullRect {
        let rects: PortalUtils.FullRect[] = this._getPossibleRects(x, y, z, region);
        for(let rect of rects){
            if(this._checkRect(rect, region)) return rect;
        }
    }

    public buildPortal(rect: PortalUtils.FullRect, region: BlockSource, isNewOne: boolean): void {
        if(isNewOne){
            this._clearArea(rect, region);
            this._buildPortalFrame(rect, region);
        }
        this._buildPortalPlane(rect, region);
    }

    public getBuilder(): PortalUtils.PortalBuilder {
        let self: PortalShape = this;
        return (pos: Vector, region: BlockSource) => {
            pos.y++;
            let rect: PortalUtils.FullRect = self._buildRect({
                x: Math.floor(pos.x),
                y: Math.floor(pos.y) - 2,
                z: Math.floor(pos.z) - 1
            }, {
                minX: 0, minY: 0,
                maxX: self.minWidth + 1,
                maxY: self.minHeight + 1,
                plane: self.orientation.vertical ? "oX" : "oY"
            });
            self.buildPortal(rect, region, true);
        }
    }

    public makeNormalTransfer(from: number, to: number): PortalShape {
        let that = this;
        Callback.addCallback("CustomDimensionTransfer", function(entity: number, dimfrom: number, dimto: number){
            if(from == dimfrom && to == dimto){
                let region: BlockSource = BlockSource.getDefaultForDimension(to);
                let pos: Vector = Entity.getPosition(entity);
                let surf = GenerationUtils.findSurface(pos.x, 92, pos.z);
                Updatable.addUpdatable({
                    age: 0,
                    update(){
                        Entity.setPosition(entity, surf.x, surf.y + 2, surf.z);
                        this.remove = this.age++ > 5
                    }
                } as Updatable);
                if(that.findPortal(pos.x, pos.y, pos.z, region)) that.getBuilder()(pos, region);
            }
        });
        return this;
    }

    public makeDestroyEvent(): PortalShape {
        let that = this;
        Callback.addCallback("DestroyBlock", function(coords, block, player){
            if(that.buildIds.portal == block.id || that.frameIds[block.id]){
                let frames: number[] = [];
                for(let frame in that.frameIds){
                    if(that.frameIds[frame]) frames.push(parseInt(frame));
                }
                DimensionHelper.eliminateIncorrectPlacedPortals(coords, that.buildIds.portal, frames, BlockSource.getDefaultForActor(player));
            }
        });
        return this;
    }

}

namespace DimensionHelper {

    export interface PortalSearchingOptions {
        radius: number;
        range: [number, number];
        fast: boolean;
    }

    export interface PlayerAdjustOptions {
        frameId: number;
        placePortal: boolean;
        movePlayer: boolean;
    }

    export class PortalChecker implements Updatable {

        public remove: boolean;
        private validIds: {[key: number]: boolean};
        private portalId: number;
        private pos: Vector;
        private region: BlockSource;

        private _checkPortal(x: number, y: number, z: number): boolean {
            let count: number = 0;
            if(this.validIds[this.region.getBlockId(x - 1, y, z)] && this.validIds[this.region.getBlockId(x + 1, y, z)]) count++;
            if(this.validIds[this.region.getBlockId(x, y - 1, z)] && this.validIds[this.region.getBlockId(x, y + 1, z)]) count++;
            if(this.validIds[this.region.getBlockId(x, y, z - 1)] && this.validIds[this.region.getBlockId(x, y, z + 1)]) count++;
            return count == 2;
        }

        private _checkRecursive(x: number, y: number, z: number): void {
            if(this.region.getBlockId(x, y, z) == this.portalId){
                if(!this._checkPortal(x, y, z)){
                    this.region.setBlock(x, y, z, 0, 0);
                    this._checkAround(x, y, z);
                }
            }
        }

        private _checkAround(x: number, y: number, z: number): void {
            this._checkRecursive(x + 1, y, z);
            this._checkRecursive(x - 1, y, z);
            this._checkRecursive(x, y + 1, z);
            this._checkRecursive(x, y - 1, z);
            this._checkRecursive(x, y, z + 1);
            this._checkRecursive(x, y, z - 1);
        }

        public update(): void {
            this.remove = true;
            this._checkAround(this.pos.x, this.pos.y, this.pos.z);
        }

        constructor(validIds: {[key: number]: boolean}, portalId: number, pos: Vector, region: BlockSource){
            this.remove = false;
            this.validIds = validIds;
            this.portalId = portalId;
            this.pos = pos;
            this.region = region;
        }

    }

    export function searchForPortal(pos: Vector, blockId: number, region: BlockSource, options: PortalSearchingOptions): Vector {
        if(!options) options = {} as PortalSearchingOptions;
        if(!options.radius) options.radius = 3;
        if(!options.range) options.range = [0, 256];
        let rad: number = options.radius;
        let closestPos: Vector = null;
        let closestDis: number = -1;
        let posX: number = Math.floor(pos.x), posZ: number = Math.floor(pos.z);
        for(let y = options.range[0]; y < options.range[1]; y++){
            for(let x = -rad; x <= rad; x++){
                for(let z = -rad; z <= rad; z++){
                    let px: number = posX + x;
                    let pz: number = posZ + z;
                    if(region.getBlockId(px, y, pz) == blockId){
                        let dis: number = x * x + (y - 128) * (y - 128) + z * z;
                        if(dis < closestDis || !closestPos){
                            closestDis = dis;
                            closestPos = {x: px, y: y, z: pz};
                        }
                        if(options.fast) break;
                    }
                }
            }
        }
        return closestPos;
    }

    export function adjustPlayerInPortal(pos: Vector, blockId: number, region: BlockSource, player: number, options: PlayerAdjustOptions): Vector {
        if(!options) options = {} as PlayerAdjustOptions;
        if(!options.frameId) options.frameId = 1;
        let posx: number = Math.floor(pos.x), posy: number = Math.floor(pos.y), posz: number = Math.floor(pos.z);
        while(region.getBlockId(posx, posy, posz) == blockId && posy > 0) posy--;
        if(options.frameId > 0 && region.getBlockId(posx, posy, posz) == 0) region.setBlock(posx, posy, posz, options.frameId, 0);
        for(let y = 1; y < 3; y++){
            let bid: number = region.getBlockId(posx, posy + y, posz);
            if(bid != 0 && bid != blockId) region.setBlock(posx, posy + y, posz, options.placePortal ? blockId : 0, 0);
        }
        let result: Vector = {x: posx + .5, y: posy + 2.63, z: posz + .5};
        if(options.movePlayer) Entity.setPosition(player, result.x, result.y, result.z);
        return result;
    }

    export function eliminateIncorrectPlacedPortals(pos: Vector, portalId: number, frameIds: number[], region: BlockSource): void {
        let validIds: {[key: number]: boolean};
        validIds[portalId] = true;
        for(let frame of frameIds) validIds[frame] = true;
        Updatable.addUpdatable(new PortalChecker(validIds, portalId, pos, region));
    }

}

EXPORT("PortalUtils", PortalUtils);
EXPORT("PortalShape", PortalShape);
EXPORT("DimensionHelper", DimensionHelper);