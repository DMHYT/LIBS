/// <reference path="core-engine.d.ts" />
declare namespace CompassUtils {
    interface Vec2 {
        x: number;
        z: number;
    }
    function textureIndexFrom(entity: number, x: number, z: number): number;
    function calculateDeltaAngle(entity: number, x: number, z: number): number;
    function calculateAngleInRightTriangle(entityPos: Vec2, pos: Vec2): number;
    function toDegrees(radians: number): number;
    function distance(x1: number, z1: number, x2: number, z2: number): number;
    function cathetus(cathetus: number, hypotenuse: number): number;
    function cosineTheorem(a: number, b: number, c: number): number;
}
