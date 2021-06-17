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
var PortalUtils;
(function (PortalUtils) {
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
    PortalUtils.PORTAL_BLOCK_TYPE = Block.createSpecialType({
        name: "customportal",
        base: 90,
        lightlevel: 15,
        rendertype: 0,
        renderlayer: 1,
        explosionres: 9999
    });
    PortalUtils.RENDER_TYPE_FULL = "full";
    PortalUtils.RENDER_TYPE_VERTICAL_PLANE = "v-plane";
    PortalUtils.RENDER_TYPE_HORIZONTAL_PLANE = "h-plane";
    PortalUtils.RENDER_TYPE_UNIVERSAL_PLANE = "u-plane";
    function setupPortalBlock(id, texture, portalRenderParams) {
        var render = new ICRender.Model();
        var group = ICRender.getGroup("custom_portal_block_" + id);
        if (!portalRenderParams.ignoreSelf)
            group.add(id, -1);
        if (portalRenderParams.frameId)
            group.add(portalRenderParams.frameId, -1);
        if (portalRenderParams.type == "full")
            render.addEntry(BlockRenderer.createTexturedBlock(texture));
        else if (portalRenderParams.type == "h-plane")
            render.addEntry(BlockRenderer.createTexturedBox(0, .375, 0, 1, 625, 1, texture));
        else if (portalRenderParams.type == "v-plane") {
            var xAxis = BlockRenderer.createTexturedBox(0, 0, .375, 1, 1, .625, texture);
            var zAxis = BlockRenderer.createTexturedBox(.375, 0, 0, .625, 1, 1, texture);
            render.addEntry(xAxis).setCondition(ICRender.NOT(ICRender.OR(ICRender.BLOCK(0, 0, 1, group, false), ICRender.BLOCK(0, 0, -1, group, false))));
            render.addEntry(zAxis).setCondition(ICRender.OR(ICRender.BLOCK(0, 0, 1, group, false), ICRender.BLOCK(0, 0, -1, group, false)));
        }
        else if (portalRenderParams.type == "u-plane") {
            var xAxis = BlockRenderer.createTexturedBox(0, 0, .375, 1, 1, .625, texture);
            var yAxis = BlockRenderer.createTexturedBox(0, .375, 0, 1, .625, 1, texture);
            var zAxis = BlockRenderer.createTexturedBox(.375, 0, 0, .625, 1, 1, texture);
            render.addEntry(xAxis).setCondition(ICRender.NOT(ICRender.OR(ICRender.BLOCK(0, 0, 1, group, false), ICRender.BLOCK(0, 0, -1, group, false))));
            render.addEntry(zAxis).setCondition(ICRender.AND(ICRender.OR(ICRender.BLOCK(0, 0, 1, group, false), ICRender.BLOCK(0, 0, -1, group, false)), ICRender.NOT(ICRender.AND(ICRender.BLOCK(1, 0, 0, group, false), ICRender.BLOCK(-1, 0, 0, group, false), ICRender.BLOCK(0, 0, 1, group, false), ICRender.BLOCK(0, 0, -1, group, false)))));
            render.addEntry(yAxis).setCondition(ICRender.AND(ICRender.BLOCK(1, 0, 0, group, false), ICRender.BLOCK(-1, 0, 0, group, false), ICRender.BLOCK(0, 0, 1, group, false), ICRender.BLOCK(0, 0, -1, group, false)));
        }
        else
            return Logger.Log("invalid portal block render type: " + portalRenderParams.type, "PortalUtils ERROR");
        BlockRenderer.setStaticICRender(id, -1, render);
    }
    // function addTransferUpdatable(dimension: number, entity: number, x: number, y: number, z: number, alterDim: number): void {
    //     Updatable.addUpdatable(new TransferUpdatable(dimension, entity, x, y, z, alterDim));
    // }
    var PortalBlock = /** @class */ (function () {
        function PortalBlock(id, texture, portalRenderParams, dimension, debugEnabled) {
            this.id = IDRegistry.genBlockID(id);
            if (texture && typeof texture[0] === "string")
                texture = [texture];
            Block.createBlock(id, [
                { name: "tile.portal." + this.id, texture: texture, inCreative: debugEnabled }
            ], "customportal");
            BlockRenderer.setCustomCollisionShape(this.id, -1, new ICRender.CollisionShape());
            Block.setDestroyTime(this.id, -1);
            if (portalRenderParams)
                setupPortalBlock(this.id, texture, portalRenderParams);
            if (!dimension.from)
                dimension.from = 0;
            // let addUpd = addTransferUpdatable;
            Block.registerEntityInsideFunctionForID(this.id, function (coords, block, entity) {
                // addTransferUpdatable(dimension.to, entity, coords.x, coords.y, coords.z, dimension.from);
                if (Entity.getDimension(entity) != dimension.to) {
                    Dimensions.transfer(entity, dimension.to);
                }
                else
                    Dimensions.transfer(entity, dimension.from);
            });
        }
        PortalBlock.prototype.getId = function () { return this.id; };
        return PortalBlock;
    }());
    PortalUtils.PortalBlock = PortalBlock;
})(PortalUtils || (PortalUtils = {}));
var PortalShape = /** @class */ (function () {
    function PortalShape() {
        this.spaceIds = { 0: true };
        this.frameIds = {};
        this.buildIds = {
            portal: -1,
            frame: -1
        };
        this.orientation = {
            vertical: true,
            horizontal: true
        };
    }
    PortalShape.prototype.setMinSize = function (w, h) {
        this.minWidth = w;
        this.minHeight = h;
        return this;
    };
    PortalShape.prototype.setPortalId = function (id) {
        this.buildIds.portal = id;
        this.spaceIds[id] = true;
        return this;
    };
    PortalShape.prototype.setFrameIds = function () {
        var ids = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ids[_i] = arguments[_i];
        }
        this.frameIds = {};
        this.buildIds.frame = ids[0];
        for (var i in ids)
            this.frameIds[ids[i]] = true;
        return this;
    };
    PortalShape.prototype.setSpaceIds = function () {
        var ids = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ids[_i] = arguments[_i];
        }
        this.spaceIds = { 0: true };
        for (var i in ids)
            this.spaceIds[ids[i]] = true;
        return this;
    };
    PortalShape.prototype.setHorizontal = function (horizontal) {
        this.orientation.horizontal = horizontal;
        return this;
    };
    PortalShape.prototype.isFrameTileAt = function (x, y, z, region) {
        return this.frameIds[region.getBlockId(x, y, z)];
    };
    PortalShape.prototype.isSpaceTileAt = function (x, y, z, region) {
        return this.spaceIds[region.getBlockId(x, y, z)];
    };
    PortalShape.prototype._searchForFrameTile = function (x, y, z, ax, ay, az, region) {
        var len = 0;
        while (!this.isFrameTileAt(x, y, z, region)) {
            x += ax, y += ay, z += az, len++;
            if (len > 16)
                return -1;
        }
        return len;
    };
    PortalShape.prototype._buildRect = function (pos, raw) {
        if (raw.minX != -1 && raw.minY != -1 && raw.maxX != -1 && raw.maxY != -1) {
            var rect = {
                minX: -raw.minX,
                maxX: raw.maxX + 1,
                minY: -raw.minY,
                maxY: raw.maxY + 1,
                plane: raw.plane,
                width: function () {
                    return this.maxX - this.minX;
                },
                height: function () {
                    return this.maxY - this.minY;
                },
                offset: pos
            };
            switch (rect.plane) {
                case "oX":
                    rect.convert = function (x, y, z) {
                        return {
                            x: this.offset.x + (z || 0),
                            y: this.offset.y + y,
                            z: this.offset.z + x
                        };
                    };
                    break;
                case "oY":
                    rect.convert = function (x, y, z) {
                        return {
                            x: this.offset.x + x,
                            y: this.offset.y + (z || 0),
                            z: this.offset.z + y
                        };
                    };
                    break;
                case "oZ":
                    rect.convert = function (x, y, z) {
                        return {
                            x: this.offset.x + x,
                            y: this.offset.y + y,
                            z: this.offset.z + (z || 0)
                        };
                    };
                    break;
                default: return;
            }
            return rect;
        }
    };
    PortalShape.prototype._getPossibleRects = function (x, y, z, region) {
        var distances = {
            left: this._searchForFrameTile(x, y, z, -1, 0, 0, region),
            right: this._searchForFrameTile(x, y, z, 1, 0, 0, region),
            down: this._searchForFrameTile(x, y, z, 0, -1, 0, region),
            up: this._searchForFrameTile(x, y, z, 0, 1, 0, region),
            back: this._searchForFrameTile(x, y, z, 0, 0, -1, region),
            forward: this._searchForFrameTile(x, y, z, 0, 0, 1, region),
        };
        var rawRects = [];
        if (this.orientation.horizontal) {
            rawRects.push({
                minX: distances.left,
                maxX: distances.right,
                minY: distances.back,
                maxY: distances.forward,
                plane: "oY"
            });
        }
        if (this.orientation.vertical) {
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
        var rects = [];
        for (var i in rawRects) {
            var raw = rawRects[i];
            var rect = this._buildRect({ x: x, y: y, z: z }, raw);
            if (rect && rect.width() - 1 >= this.minWidth && rect.height() - 2 >= this.minHeight) {
                rects.push(rect);
            }
        }
        return rects;
    };
    PortalShape.prototype._checkRect = function (rect, region) {
        for (var x = rect.minX + 1; x < rect.maxX - 1; x++) {
            var pos1 = rect.convert(x, rect.minY);
            var pos2 = rect.convert(x, rect.maxY - 1);
            if (!this.isFrameTileAt(pos1.x, pos1.y, pos1.z, region) || !this.isFrameTileAt(pos2.x, pos2.y, pos2.z, region))
                return false;
        }
        for (var y = rect.minY + 1; y < rect.maxY - 1; y++) {
            var pos1 = rect.convert(rect.minX, y);
            var pos2 = rect.convert(rect.maxX - 1, y);
            if (!this.isFrameTileAt(pos1.x, pos1.y, pos1.z, region) || !this.isFrameTileAt(pos2.x, pos2.y, pos2.z, region))
                return false;
        }
        for (var x = rect.minX + 1; x < rect.maxX - 1; x++) {
            for (var y = rect.minY + 1; y < rect.maxY - 1; y++) {
                var pos = rect.convert(x, y);
                if (!this.isSpaceTileAt(pos.x, pos.y, pos.z, region))
                    return false;
            }
        }
        return true;
    };
    PortalShape.prototype._buildPortalPlane = function (rect, region) {
        for (var x = rect.minX + 1; x < rect.maxX - 1; x++) {
            for (var y = rect.minY + 1; y < rect.maxY - 1; y++) {
                var pos = rect.convert(x, y);
                region.setBlock(pos.x, pos.y, pos.z, this.buildIds.portal, 0);
            }
        }
    };
    PortalShape.prototype._buildPortalFrame = function (rect, region) {
        for (var x = rect.minX; x < rect.maxX; x++) {
            var pos = rect.convert(x, rect.minY);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
            pos = rect.convert(x, rect.maxY - 1);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
            pos = rect.convert(x, rect.minY, -1);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
            pos = rect.convert(x, rect.minY, 1);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
        }
        for (var y = rect.minY; y < rect.maxY; y++) {
            var pos = rect.convert(rect.minX, y);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
            pos = rect.convert(rect.maxX - 1, y);
            region.setBlock(pos.x, pos.y, pos.z, this.buildIds.frame, 0);
        }
    };
    PortalShape.prototype._clearArea = function (rect, region) {
        for (var z = -2; z <= 2; z++) {
            for (var x = rect.minX; x < rect.maxX; x++) {
                for (var y = rect.minY + 1; y < rect.maxY; y++) {
                    var pos = rect.convert(x, y, z);
                    region.setBlock(pos.x, pos.y, pos.z, 0, 0);
                }
            }
        }
    };
    PortalShape.prototype.findPortal = function (x, y, z, region) {
        var rects = this._getPossibleRects(x, y, z, region);
        for (var i in rects)
            if (this._checkRect(rects[i], region))
                return rects[i];
    };
    PortalShape.prototype.buildPortal = function (rect, region, isNewOne) {
        if (isNewOne) {
            this._clearArea(rect, region);
            this._buildPortalFrame(rect, region);
        }
        this._buildPortalPlane(rect, region);
    };
    PortalShape.prototype.getBuilder = function () {
        var self = this;
        return function (pos, region) {
            pos.y++;
            var rect = self._buildRect({
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
        };
    };
    PortalShape.prototype.makeNormalTransfer = function (from, to) {
        var that = this;
        Callback.addCallback("CustomDimensionTransfer", function (entity, dimfrom, dimto) {
            if (from == dimfrom && to == dimto) {
                var region = BlockSource.getDefaultForDimension(to);
                var pos = Entity.getPosition(entity);
                var surf_1 = GenerationUtils.findSurface(pos.x, 92, pos.z);
                Updatable.addUpdatable({
                    age: 0,
                    update: function () {
                        Entity.setPosition(entity, surf_1.x, surf_1.y + 2, surf_1.z);
                        this.remove = this.age++ > 5;
                    }
                });
                if (that.findPortal(pos.x, pos.y, pos.z, region))
                    that.getBuilder()(pos, region);
            }
        });
        return this;
    };
    PortalShape.prototype.makeDestroyEvent = function () {
        var that = this;
        Callback.addCallback("DestroyBlock", function (coords, block, player) {
            if (that.buildIds.portal == block.id || that.frameIds[block.id]) {
                var frames = [];
                for (var frame in that.frameIds) {
                    if (that.frameIds[frame])
                        frames.push(parseInt(frame));
                }
                DimensionHelper.eliminateIncorrectPlacedPortals(coords, that.buildIds.portal, frames, BlockSource.getDefaultForActor(player));
            }
        });
        return this;
    };
    return PortalShape;
}());
var DimensionHelper;
(function (DimensionHelper) {
    var PortalChecker = /** @class */ (function () {
        function PortalChecker(validIds, portalId, pos, region) {
            this.remove = false;
            this.validIds = validIds;
            this.portalId = portalId;
            this.pos = pos;
            this.region = region;
        }
        PortalChecker.prototype._checkPortal = function (x, y, z) {
            var count = 0;
            if (this.validIds[this.region.getBlockId(x - 1, y, z)] && this.validIds[this.region.getBlockId(x + 1, y, z)])
                count++;
            if (this.validIds[this.region.getBlockId(x, y - 1, z)] && this.validIds[this.region.getBlockId(x, y + 1, z)])
                count++;
            if (this.validIds[this.region.getBlockId(x, y, z - 1)] && this.validIds[this.region.getBlockId(x, y, z + 1)])
                count++;
            return count == 2;
        };
        PortalChecker.prototype._checkRecursive = function (x, y, z) {
            if (this.region.getBlockId(x, y, z) == this.portalId) {
                if (!this._checkPortal(x, y, z)) {
                    this.region.setBlock(x, y, z, 0, 0);
                    this._checkAround(x, y, z);
                }
            }
        };
        PortalChecker.prototype._checkAround = function (x, y, z) {
            this._checkRecursive(x + 1, y, z);
            this._checkRecursive(x - 1, y, z);
            this._checkRecursive(x, y + 1, z);
            this._checkRecursive(x, y - 1, z);
            this._checkRecursive(x, y, z + 1);
            this._checkRecursive(x, y, z - 1);
        };
        PortalChecker.prototype.update = function () {
            this.remove = true;
            this._checkAround(this.pos.x, this.pos.y, this.pos.z);
        };
        return PortalChecker;
    }());
    DimensionHelper.PortalChecker = PortalChecker;
    function searchForPortal(pos, blockId, region, options) {
        if (!options)
            options = {};
        if (!options.radius)
            options.radius = 3;
        if (!options.range)
            options.range = [0, 256];
        var rad = options.radius;
        var closestPos = null;
        var closestDis = -1;
        var posX = Math.floor(pos.x), posZ = Math.floor(pos.z);
        for (var y = options.range[0]; y < options.range[1]; y++) {
            for (var x = -rad; x <= rad; x++) {
                for (var z = -rad; z <= rad; z++) {
                    var px = posX + x;
                    var pz = posZ + z;
                    if (region.getBlockId(px, y, pz) == blockId) {
                        var dis = x * x + (y - 128) * (y - 128) + z * z;
                        if (dis < closestDis || !closestPos) {
                            closestDis = dis;
                            closestPos = { x: px, y: y, z: pz };
                        }
                        if (options.fast)
                            break;
                    }
                }
            }
        }
        return closestPos;
    }
    DimensionHelper.searchForPortal = searchForPortal;
    function adjustPlayerInPortal(pos, blockId, region, player, options) {
        if (!options)
            options = {};
        if (!options.frameId)
            options.frameId = 1;
        var posx = Math.floor(pos.x), posy = Math.floor(pos.y), posz = Math.floor(pos.z);
        while (region.getBlockId(posx, posy, posz) == blockId && posy > 0)
            posy--;
        if (options.frameId > 0 && region.getBlockId(posx, posy, posz) == 0)
            region.setBlock(posx, posy, posz, options.frameId, 0);
        for (var y = 1; y < 3; y++) {
            var bid = region.getBlockId(posx, posy + y, posz);
            if (bid != 0 && bid != blockId)
                region.setBlock(posx, posy + y, posz, options.placePortal ? blockId : 0, 0);
        }
        var result = { x: posx + .5, y: posy + 2.63, z: posz + .5 };
        if (options.movePlayer)
            Entity.setPosition(player, result.x, result.y, result.z);
        return result;
    }
    DimensionHelper.adjustPlayerInPortal = adjustPlayerInPortal;
    function eliminateIncorrectPlacedPortals(pos, portalId, frameIds, region) {
        var validIds;
        validIds[portalId] = true;
        for (var i in frameIds)
            validIds[frameIds[i]] = true;
        Updatable.addUpdatable(new PortalChecker(validIds, portalId, pos, region));
    }
    DimensionHelper.eliminateIncorrectPlacedPortals = eliminateIncorrectPlacedPortals;
})(DimensionHelper || (DimensionHelper = {}));
EXPORT("PortalUtils", PortalUtils);
EXPORT("PortalShape", PortalShape);
EXPORT("DimensionHelper", DimensionHelper);
