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

namespace CompassUtils {

    export interface Vec2 {
        x: number, z: number
    }

    export function textureIndexFrom(entity: number, x: number, z: number): number {
        let delta: number = calculateDeltaAngle(entity, x, z);
        for(let i=0; i<31; i++){
            let degree = 11.25 * i;
            if(delta <= degree + 5.625 && delta > degree - 5.625){
                return (i + 16) % 31;
            }
        }
        return 0;
    }

    export function calculateDeltaAngle(entity: number, x: number, z: number): number {
        return calculateAngleInRightTriangle(Entity.getPosition(entity), {x: x, z: z}) + (toDegrees(Entity.getLookAngle(entity).yaw)) + 180;
    }

    export function calculateAngleInRightTriangle(entityPos: Vec2, pos: Vec2): number {
        let xA: number, zA: number, 
            xB: number, zB: number, 
            xC: number, zC: number, 
            AC: number, BC: number, AB: number;
        xB = pos.x, zB = pos.z, xA = entityPos.x, zA = entityPos.z;
        xC = xA, zC = zB;
        AB = distance(xA, xB, zA, zB);
        AC = distance(xA, xC, zA, zC);
        BC = cathetus(AC, AB);
        let cos: number = cosineTheorem(BC, AC, AB);
        if(cos === 1) return 0;
        let result: number = Math.acos(cos);
        if(xB > xC) result = 360 - result;
        return result;
    }

    export function toDegrees(radians: number): number {
        return radians * 180 / Math.PI;
    }

    export function distance(x1: number, z1: number, x2: number, z2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
    }

    export function cathetus(cathetus: number, hypotenuse: number): number {
        return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(cathetus, 2));
    }

    export function cosineTheorem(a: number, b: number, c: number): number {
        return (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c);
    }

}

EXPORT("Compass", CompassUtils);