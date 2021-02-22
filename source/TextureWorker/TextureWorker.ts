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
    version: 5,
    shared: false,
    api: "CoreEngine"
});

//by vstannumdum
//VK - https://www.vk.com/vstannumdum
//VK Public - https://www.vk.com/dmhmods

namespace TextureWorker {

    namespace HelpingFuncs {

        export function RGBToHSV(r: number, g: number, b: number): [h: number, s: number, v: number] {
            try {
                r /= g /= b /= 255;
                let cmax = Math.max(r, g, b), cmin = Math.min(r, g, b),
                    diff = cmax - cmin, h = -1, s = -1, v = cmax * 100;
                switch(true){
                    case cmax == cmin: 
                        h = 0; break;
                    case cmax == r: 
                        h = ( 60 * ( (g - b) / diff) + 360 ) % 360; break;
                    case cmax == g: 
                        h = ( 60 * ( (b - r) / diff) + 120 ) % 360; break;
                    case cmax == b: 
                        h = ( 60 * ( (r - g) / diff) + 240 ) % 360; break;
                }
                if(cmax == 0){
                    s = 0;
                } else s = (diff / cmax) * 100;
                return [ h, s, v ];
            } catch(e){
                Logger.Log("Some errors occured during RGB to HSV conversion", "TextureWorker ERROR");
                if(e instanceof java.lang.Throwable) Logger.LogError(e);
            }
        }
    
        export function HSVToRGB(h: number, s: number, v: number): [r: number, g: number, b: number] | void {
            try {
                if(h > 360 || h < 0 || s > 100 || s < 0 || v > 100 || v < 0){
                    return Logger.Log("Error in converting HSV to RGB color", "TextureWorker ERROR");
                }
                s /= v /= 100;
                let C = s * v, X = C * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - C, r: number, g: number, b: number;
                switch(true){
                    case h >= 0 && h < 60: 
                        r = C, g = X, b = 0; break;
                    case h >= 60 && h < 120: 
                        r = X, g = C, b = 0; break;
                    case h >= 120 && h < 180:
                        r = 0, g = C, b = X; break;
                    case h >= 180 && h < 240:
                        r = 0, g = X, b = C; break;
                    case h >= 240 && h < 300:
                        r = X, g = 0, b = C; break;
                    default:
                        r = C, g = 0, b = X;
                }
                return [
                    (r + m) * 255,
                    (g + m) * 255,
                    (b + m) * 255
                ];
            } catch(e){
                Logger.Log("Some errors occured during HSV to RGB conversion", "TextureWorker ERROR");
                if(e instanceof java.lang.Throwable) Logger.LogError(e);
            }
        }
    
        export function changeBitmapColor(bitmap: android.graphics.Bitmap, r: number, g: number, b: number): android.graphics.Bitmap {
            try {
                let newBmp = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), bitmap.getConfig());
                for(let x=0; x<bitmap.getWidth(); x++){
                    for(let y=0; y<bitmap.getHeight(); y++){
                        let px = bitmap.getPixel(x, y),
                            red = android.graphics.Color.red(px),
                            green = android.graphics.Color.green(px),
                            blue = android.graphics.Color.blue(px),
                            alpha = android.graphics.Color.alpha(px);
                        if(alpha !== 0){
                            let pixelHSV = RGBToHSV(red, green, blue),
                                givenHSV = RGBToHSV(r, g, b),
                                finalRGB = HSVToRGB(givenHSV[0], pixelHSV[1], pixelHSV[2]);
                            newBmp.setPixel(x, y, android.graphics.Color.argb(alpha, finalRGB[0], finalRGB[1], finalRGB[2]));
                        }
                    }
                }
                return newBmp;
            } catch(e){
                Logger.Log("Some errors occured during changing bitmap color", "TextureWorker ERROR");
                if(e instanceof java.lang.Throwable) Logger.LogError(e);
            }
        }
    
        export function toGrayscale(bitmap: android.graphics.Bitmap): android.graphics.Bitmap {
            try {
                let grayscaled: android.graphics.Bitmap = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
                let c: android.graphics.Canvas = new android.graphics.Canvas(grayscaled);
                let paint: android.graphics.Paint = new android.graphics.Paint();
                let cm: android.graphics.ColorMatrix = new android.graphics.ColorMatrix();
                cm.setSaturation(0);
                let f: android.graphics.ColorMatrixColorFilter = new android.graphics.ColorMatrixColorFilter(cm);
                paint.setColorFilter(f);
                c.drawBitmap(bitmap, 0, 0, paint);
                return grayscaled;
            } catch(e){
                Logger.Log("Somer errors occured during grayscaling a bitmap", "TextureWorker ERROR");
                if(e instanceof java.lang.Throwable) Logger.LogError(e);
            }
        }
        
    }

    /**
     * Returns an absolute path of given path from mod directory
     */
    export const fromModDir = (texturesource: ITextureSource) => ({name: texturesource.name, path: `${__dir__}/${texturesource.path}`} as ITextureSource);
    
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
        try {
            if(FileTools.isExists(args.result.path + args.result.name + ".png")){
                Logger.Log("File with the path, given in method \'TextureWorker.createTextureWithOverlays\', already exists, texture generation process stopped", "TextureWorker DEBUG");
                return;
            }
            const bmp: android.graphics.Bitmap = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config || android.graphics.Bitmap.Config.ARGB_8888);
            const cvs: android.graphics.Canvas = new android.graphics.Canvas(bmp);
            for(let i in args.overlays){
                let over: IOverlay = args.overlays[i];
                let tex: android.graphics.Bitmap = FileTools.ReadImage(over.path + over.name + ".png");
                if(over.color !== null){
                    cvs.drawBitmap(HelpingFuncs.changeBitmapColor(tex, over.color[0], over.color[1], over.color[2]), 0, 0, null);
                } else cvs.drawBitmap(tex, 0, 0, null);
            }
            FileTools.WriteImage(args.result.path + args.result.name + ".png", bmp);
            bmp.finalize();
            cvs.finalize();
            if(fallback) return FileTools.ReadImage(args.result.path + args.result.name + ".png");
        } catch(e){
            Logger.Log("Some errors occured while calling method \'TextureWorker.createTextureWithOverlays\'", "TextureWorker ERROR");
            if(e instanceof java.lang.Throwable) Logger.LogError(e);
        }
    }

    /**
     * Creates a new texture from given, with changed color
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true 
     */
    export function paintTexture(args: {bitmap: IBitmap, src: ITextureSource, color: [r: number, g: number, b: number], result: ITextureSource}, fallback?: boolean): android.graphics.Bitmap | void {
        try {
            if(FileTools.isExists(args.result.path + args.result.name + ".png")){
                Logger.Log("File with the path, given in method \'TextureWorker.paintTexture\', already exists, texture generation process stopped", "TextureWorker DEBUG");
                return;
            }
            const bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config || android.graphics.Bitmap.Config.ARGB_8888);
            const cvs = new android.graphics.Canvas(bmp);
            let tex: android.graphics.Bitmap = FileTools.ReadImage(args.src.path + args.src.name + ".png");
            cvs.drawBitmap(HelpingFuncs.changeBitmapColor(tex, args.color[0], args.color[1], args.color[2]), 0, 0, null);
            FileTools.WriteImage(args.result.path + args.result.name + ".png", bmp);
            bmp.finalize();
            cvs.finalize();
            tex.finalize();
            if(fallback) return FileTools.ReadImage(args.result.path + args.result.name + ".png");
        } catch(e){
            Logger.Log("Some errors occured while calling method \'TextureWorker.paintTexture\'", "TextureWorker ERROR");
            if(e instanceof java.lang.Throwable) Logger.LogError(e);
        }
    }

    /**
     * Creates a grayscaled texture from given
     * @param src source texture path and name
     * @param result result texture path and name
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    export function grayscaleImage(src: ITextureSource, result: ITextureSource, fallback?: boolean): android.graphics.Bitmap | void {
        try {
            if(FileTools.isExists(result.path + result.name + ".png")){
                Logger.Log("File with the path, given in method \'TextureWorker.grayscaleImage\' already exists, texture generation process stopped", "TextureWorker DEBUG");
                return;
            }
            const grayscaled: android.graphics.Bitmap = HelpingFuncs.toGrayscale(FileTools.ReadImage(src.path + src.name + ".png"));
            FileTools.WriteImage(result.path + result.name + ".png", grayscaled);
            if(fallback) return grayscaled;
        } catch(e){
            Logger.Log("Some errors occured while calling method \'TextureWorker.grayscaleImage\'", "TextureWorker ERROR");
            if(e instanceof java.lang.Throwable) Logger.LogError(e);
        }
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
        args.src = fromModDir(args.result);
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