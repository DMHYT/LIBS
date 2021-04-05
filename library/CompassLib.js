/// <reference path="../../declarations/core-engine.d.ts" />
/*
 █████╗  █████╗ ███╗   ███╗██████╗  █████╗  ██████╗ ██████╗██╗     ██╗██████╗
██╔══██╗██╔══██╗████╗ ████║██╔══██╗██╔══██╗██╔════╝██╔════╝██║     ██║██╔══██╗
██║  ╚═╝██║  ██║██╔████╔██║██████╔╝███████║╚█████╗ ╚█████╗ ██║     ██║██████╦╝
██║  ██╗██║  ██║██║╚██╔╝██║██╔═══╝ ██╔══██║ ╚═══██╗ ╚═══██╗██║     ██║██╔══██╗
╚█████╔╝╚█████╔╝██║ ╚═╝ ██║██║     ██║  ██║██████╔╝██████╔╝███████╗██║██████╦╝
 ╚════╝  ╚════╝ ╚═╝     ╚═╝╚═╝     ╚═╝  ╚═╝╚═════╝ ╚═════╝ ╚══════╝╚═╝╚═════╝
*/
LIBRARY({
    name: "CompassLib",
    version: 1,
    shared: false,
    api: 'CoreEngine'
});
//by vstannumdum
//VK - https://www.vk.com/vstannumdum
//VK Public - https://www.vk.com/dmhmods
var CompassUtils;
(function (CompassUtils) {
    function textureIndexFrom(entity, x, z) {
        var delta = calculateDeltaAngle(entity, x, z);
        for (var i = 0; i < 31; i++) {
            var degree = 11.25 * i;
            if (delta <= degree + 5.625 && delta > degree - 5.625) {
                return (i + 16) % 31;
            }
        }
        return 0;
    }
    CompassUtils.textureIndexFrom = textureIndexFrom;
    function calculateDeltaAngle(entity, x, z) {
        return calculateAngleInRightTriangle(Entity.getPosition(entity), { x: x, z: z }) + (toDegrees(Entity.getLookAngle(entity).yaw)) + 180;
    }
    CompassUtils.calculateDeltaAngle = calculateDeltaAngle;
    function calculateAngleInRightTriangle(entityPos, pos) {
        var xA, zA, xB, zB, xC, zC, AC, BC, AB;
        xB = pos.x, zB = pos.z, xA = entityPos.x, zA = entityPos.z;
        xC = xA, zC = zB;
        AB = distance(xA, xB, zA, zB);
        AC = distance(xA, xC, zA, zC);
        BC = cathetus(AC, AB);
        var cos = cosineTheorem(BC, AC, AB);
        if (cos === 1)
            return 0;
        var result = Math.acos(cos);
        if (xB > xC)
            result = 360 - result;
        return result;
    }
    CompassUtils.calculateAngleInRightTriangle = calculateAngleInRightTriangle;
    function toDegrees(radians) {
        return radians * 180 / Math.PI;
    }
    CompassUtils.toDegrees = toDegrees;
    function distance(x1, z1, x2, z2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
    }
    CompassUtils.distance = distance;
    function cathetus(cathetus, hypotenuse) {
        return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(cathetus, 2));
    }
    CompassUtils.cathetus = cathetus;
    function cosineTheorem(a, b, c) {
        return (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c);
    }
    CompassUtils.cosineTheorem = cosineTheorem;
})(CompassUtils || (CompassUtils = {}));
EXPORT("Compass", CompassUtils);
