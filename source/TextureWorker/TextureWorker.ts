/// <reference path="../../declarations/core-engine.d.ts" />

/*
████████╗███████╗██╗  ██╗████████╗██╗   ██╗██████╗ ███████╗ ██╗       ██╗ █████╗ ██████╗ ██╗  ██╗███████╗██████╗ 
╚══██╔══╝██╔════╝╚██╗██╔╝╚══██╔══╝██║   ██║██╔══██╗██╔════╝ ██║  ██╗  ██║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝██╔══██╗
   ██║   █████╗   ╚███╔╝    ██║   ██║   ██║██████╔╝█████╗   ╚██╗████╗██╔╝██║  ██║██████╔╝█████═╝ █████╗  ██████╔╝
   ██║   ██╔══╝   ██╔██╗    ██║   ██║   ██║██╔══██╗██╔══╝    ████╔═████║ ██║  ██║██╔══██╗██╔═██╗ ██╔══╝  ██╔══██╗
   ██║   ███████╗██╔╝╚██╗   ██║   ╚██████╔╝██║  ██║███████╗  ╚██╔╝ ╚██╔╝ ╚█████╔╝██║  ██║██║ ╚██╗███████╗██║  ██║
   ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝   ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
*/

LIBRARY({
    name: "TextureWorker",
    version: 7,
    shared: false,
    api: "CoreEngine"
});

//by vstannumdum
//VK - https://www.vk.com/vstannumdum
//VK Public - https://www.vk.com/dmhmods

namespace TextureWorker {

    export var debugMode: boolean = false;

    /**
     * Enables or disables debug mode.
     * With debug mode disabled, if the generated texture already exists on the given path,
     * texture generation process will be skipped.
     * With debug mode enabled, new texture will generate on the given path every time.
     */
    export function toggleDebugMode(debug: boolean): void { debugMode = debug }

    function changeBitmapColor(bitmap: android.graphics.Bitmap, color: [number, number, number]): android.graphics.Bitmap {
        const newbmp = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
        const canvas = new android.graphics.Canvas(newbmp);
        const paint = new android.graphics.Paint();
        paint.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(color[0], color[1], color[2]), android.graphics.PorterDuff.Mode.MULTIPLY));
        canvas.drawBitmap(bitmap, 0, 0, paint);
        return newbmp;
    }

    /**
     * Returns an absolute path of given path from mod directory
     */
    export function fromModDir(textureSource: ITextureSource | IOverlay): ITextureSource | IOverlay {
        if(textureSource.path.startsWith(__dir__)) return textureSource;
        return { name: textureSource.name, path: `${__dir__}/${textureSource.path}`, color: (textureSource as IOverlay).color };
    }
    
    /**
     * interface that represents texture's 
     * path and name that TextureWorker will work with
     */
    export interface ITextureSource {
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
    export var TEXTURE_STANDART: IBitmap = {width: 16, height: 16, config: android.graphics.Bitmap.Config.ARGB_8888};

    /**
     * Creates a new texture on the specified path, 
     * from other textures, with possibility
     * of painting each overlay into specified color.
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    export function createTextureWithOverlays(args: {bitmap: IBitmap, overlays: IOverlay[], result: ITextureSource}, fallback?: boolean): android.graphics.Bitmap | void {
        if(!debugMode && FileTools.isExists(`${args.result.path}${args.result.name}.png`)) return Logger.Log("File with the path, given in method \'TextureWorker.createTextureWithOverlays\', already exists, texture generation process cancelled", "TextureWorker DEBUG");
        const bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config ?? android.graphics.Bitmap.Config.ARGB_8888);
        const cvs = new android.graphics.Canvas(bmp);
        for(let i in args.overlays){
            const over = args.overlays[i];
            const tex = FileTools.ReadImage(`${over.path}${over.name}.png`);
            cvs.drawBitmap(over.color ? changeBitmapColor(tex, over.color) : tex, 0, 0, null);
        }
        FileTools.WriteImage(`${args.result.path}${args.result.name}.png`, bmp);
        if(fallback) return bmp;
    }

    /**
     * Creates a new texture from given, with changed color
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true 
     */
    export function paintTexture(args: {bitmap: IBitmap, src: ITextureSource, color: [r: number, g: number, b: number], result: ITextureSource}, fallback?: boolean): android.graphics.Bitmap | void {
        if(!debugMode && FileTools.isExists(`${args.result.path}${args.result.name}.png`)) return Logger.Log("File with the path, given in method \'TextureWorker.paintTexture\', already exists, texture generation process cancelled", "TextureWorker DEBUG");
        const bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config ?? android.graphics.Bitmap.Config.ARGB_8888);
        const cvs = new android.graphics.Canvas(bmp);
        cvs.drawBitmap(changeBitmapColor(FileTools.ReadImage(`${args.src.path}${args.src.name}.png`), args.color), 0, 0, null);
        FileTools.WriteImage(`${args.result.path}${args.result.name}.png`, bmp);
        if(fallback) return bmp;
    }

    /**
     * Creates a grayscaled texture from given
     * @param src source texture path and name
     * @param result result texture path and name
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    export function grayscaleImage(src: ITextureSource, result: ITextureSource, fallback?: boolean): android.graphics.Bitmap | void {
        if(!debugMode && FileTools.isExists(`${result.path}${result.name}.png`)) return Logger.Log("File with the path, given in method \'TextureWorker.grayscaleImage\' already exists, texture generation process cancelled", "TextureWorker DEBUG");
        const source = FileTools.ReadImage(`${src.path}${src.name}.png`);
        const output = android.graphics.Bitmap.createBitmap(source.getWidth(), source.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
        const cvs = new android.graphics.Canvas(output);
        const paint = new android.graphics.Paint();
        const matrix = new android.graphics.ColorMatrix();
        matrix.setSaturation(0);
        paint.setColorFilter(new android.graphics.ColorMatrixColorFilter(matrix));
        cvs.drawBitmap(source, 0, 0, paint);
        FileTools.WriteImage(`${result.path}${result.name}.png`, output);
        if(fallback) return output;
    }

    /**
     * Same as [[TextureWorker.createTextureWithOverlays]],
     * but gets given pathes not as absolute pathes, but as pathes
     * from the mod directory
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    export function createTextureWithOverlaysModDir(args: {bitmap: IBitmap, overlays: IOverlay[], result: ITextureSource}, fallback?: boolean): android.graphics.Bitmap | void {
        args.result = fromModDir(args.result);
        for(let i in args.overlays) args.overlays[i] = fromModDir(args.overlays[i]);
        return createTextureWithOverlays(args, fallback);
    }

    /**
     * Same as [[TextureWorker.paintTexture]],
     * but gets given pathes not as absolute pathes, but as pathes
     * from the mod directory
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true 
     */
    export function paintTextureModDir(args: {bitmap: IBitmap, src: ITextureSource, color: [r: number, g: number, b: number], result: ITextureSource}, fallback?: boolean): android.graphics.Bitmap | void {
        args.src = fromModDir(args.src);
        args.result = fromModDir(args.result);
        return paintTexture(args, fallback);
    }

    /**
     * Same as [[TextureWorker.grayscaleImage]],
     * but gets given pathes not as absolute pathes, but as pathes
     * from the mod directory
     * @param src source texture path and name
     * @param result result texture path and name
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    export function grayscaleImageModDir(src: ITextureSource, result: ITextureSource, fallback?: boolean): android.graphics.Bitmap | void {
        src = fromModDir(src);
        result = fromModDir(result);
        return grayscaleImage(src, result, fallback);
    }

}

EXPORT("TextureWorker", TextureWorker);