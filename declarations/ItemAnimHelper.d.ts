/// <reference path="core-engine.d.ts" />
declare namespace IAHelper {
    interface IAnimTicker {
        meta: number;
        timer: number;
        frameIndex?: number;
    }
    const itemAnims: {
        [key: string]: IAnimTicker;
    };
    function convertTexture(srcPath: string, srcName: string, resultPath: string, resultName: string): void;
    function makeCommonAnim(id: number, textureName: string, ticks: number, frames: number): void;
    function makeAdvancedAnim(id: number, textureName: string, interval: number, frames: number[]): void;
}
