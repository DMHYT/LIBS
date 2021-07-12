/// <reference path="core-engine.d.ts" />
declare namespace TextureWorker {
    var debugMode: boolean;
    /**
     * Enables or disables debug mode.
     * With debug mode disabled, if the generated texture already exists on the given path,
     * texture generation process will be skipped.
     * With debug mode enabled, new texture will generate on the given path every time.
     */
    function toggleDebugMode(debug: boolean): void;
    /**
     * Returns an absolute path of given path from mod directory
     */
    function fromModDir(textureSource: ITextureSource | IOverlay): ITextureSource | IOverlay;
    /**
     * interface that represents texture's
     * path and name that TextureWorker will work with
     */
    interface ITextureSource {
        /**
         * absolute path to the texture
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
    interface IOverlay extends ITextureSource {
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
    interface IBitmap {
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
    var TEXTURE_STANDART: IBitmap;
    /**
     * Creates a new texture on the specified path,
     * from other textures, with possibility
     * of painting each overlay into specified color.
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function createTextureWithOverlays(args: {
        bitmap: IBitmap;
        overlays: IOverlay[];
        result: ITextureSource;
    }, fallback?: boolean): android.graphics.Bitmap | void;
    /**
     * Creates a new texture from given, with changed color
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function paintTexture(args: {
        bitmap: IBitmap;
        src: ITextureSource;
        color: [r: number, g: number, b: number];
        result: ITextureSource;
    }, fallback?: boolean): android.graphics.Bitmap | void;
    /**
     * Creates a grayscaled texture from given
     * @param src source texture path and name
     * @param result result texture path and name
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function grayscaleImage(src: ITextureSource, result: ITextureSource, fallback?: boolean): android.graphics.Bitmap | void;
    /**
     * Same as [[TextureWorker.createTextureWithOverlays]],
     * but gets given pathes not as absolute pathes, but as pathes
     * from the mod directory
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function createTextureWithOverlaysModDir(args: {
        bitmap: IBitmap;
        overlays: IOverlay[];
        result: ITextureSource;
    }, fallback?: boolean): android.graphics.Bitmap | void;
    /**
     * Same as [[TextureWorker.paintTexture]],
     * but gets given pathes not as absolute pathes, but as pathes
     * from the mod directory
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function paintTextureModDir(args: {
        bitmap: IBitmap;
        src: ITextureSource;
        color: [r: number, g: number, b: number];
        result: ITextureSource;
    }, fallback?: boolean): android.graphics.Bitmap | void;
    /**
     * Same as [[TextureWorker.grayscaleImage]],
     * but gets given pathes not as absolute pathes, but as pathes
     * from the mod directory
     * @param src source texture path and name
     * @param result result texture path and name
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function grayscaleImageModDir(src: ITextureSource, result: ITextureSource, fallback?: boolean): android.graphics.Bitmap | void;
}
