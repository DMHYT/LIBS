/// <reference path="core-engine.d.ts" />
/// <reference path="android.d.ts" />

declare namespace TextureWorker {

    /**
     * interface that represents texture's 
     * path and name that TextureWorker will work with
     */
    export interface ITextureSource {
        /**
         * path to the texture from mod directory
         */
        path: string;
        /**
         * name of the texture without .png
         */
        name: string;
    }

    /**
     * interface that represents overlay texture 
     * in method TextureWorker.createTextureWithOverlays,
     * that has an optional property - color changing
     */
    export interface IOverlay extends ITextureSource {
        /**
         * RGB color to paint the overlay
         */
        color?: [r: number, g: number, b: number];
    }

    /**
     * interface that represents object for TextureWorker
     * to create new android.graphics.Bitmap object,
     * to create then a new texture from it
     */
    export interface IBitmap {
        /**
         * bitmap width
         */
        width: number;
        /**
         * bitmap height
         */
        height: number;
        /**
         * bitmap config, default is ARGB_8888
         */
        config?: android.graphics.Bitmap.Config;
    }

    /**
     * default for most of minecraft mods texture settings,
     * 16x16 size and ARGB_8888 config
     */
    export var TEXTURE_STANDART: IBitmap;

    /**
     * Creates a new texture on the specified path, 
     * from other textures, with possibility
     * of painting each overlay into specified color.
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    export function createTextureWithOverlays(args: {bitmap: IBitmap, overlays: IOverlay[], result: ITextureSource}, fallback?: boolean): android.graphics.Bitmap | void;

    /**
     * Creates a new texture from given, with changed color
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true 
     */
    export function paintTexture(args: {bitmap: IBitmap, src: ITextureSource, color: [r: number, g: number, b: number], result: ITextureSource}, fallback?: boolean): android.graphics.Bitmap | void;

}