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

    function rgb_to_hsv(r: number, g: number, b: number): [number, number, number] {
        let h: number, s: number, v: number;
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b), c = max - min;
        if(c == 0) h = 0;
        else if(max == r) h = ((g - b) / c) % 6;
        else if(max == g) h = (b - r) / c + 2;
        else h = (r - g) / c + 4;
        h *= 60;
        if(h < 0) h += 360;
        v = max;
        if(v == 0) s = 0;
        else s = c / v;
        s *= 100, v *= 100;
        return [h, s, v];
    }

    function hsv_to_rgb(h: number, s: number, v: number): [number, number, number] {
        if(h >= 360) h = 359;
        if(s > 100) s = 100;
        if(v > 100) v = 100;
        s /= 100.0, v /= 100.0;
        let c = v * s, hh = h / 60.0,
            x = c * (1.0 - Math.abs((hh % 2) - 1.0)),
            r = 0, g = 0, b = 0;
        if(hh >= 0 && h < 2) r = c, g = x;
        else if(hh >= 1 && hh < 2) r = x, g = c;
        else if(hh >= 2 && hh < 3) g = c, b = x;
        else if(hh >= 3 && hh < 4) g = x, b = c;
        else if(hh >= 4 && hh < 5) r = x, b = c;
        else r = c, b = x;
        let m = v - c;
        r += m, g += m, b += m, 
        r *= 255.0, g *= 255.0, b *= 255.0,
        r = Math.round(r), g = Math.round(g), b = Math.round(b);
        return [r, g, b];
    }

    function changeBitmapColor(bitmap: android.graphics.Bitmap, color: [number, number, number]): android.graphics.Bitmap {
        const newbmp = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
        for(let x=0; x<bitmap.getWidth(); ++x){
            for(let y=0; y<bitmap.getHeight(); ++y){
                let px = bitmap.getPixel(x, y),
                    r = android.graphics.Color.red(px),
                    g = android.graphics.Color.green(px),
                    b = android.graphics.Color.blue(px);
                let customHSV = rgb_to_hsv(color[0], color[1], color[2]),
                    pixelHSV = rgb_to_hsv(r, g, b),
                    finalRGB = hsv_to_rgb(customHSV[0], pixelHSV[1], pixelHSV[2]);
                newbmp.setPixel(x, y, android.graphics.Color.argb(android.graphics.Color.alpha(px), finalRGB[0], finalRGB[1], finalRGB[2]));
            }
        }
        return newbmp;
    }

    /**
     * Returns an absolute path of given path from mod directory
     */
    export function fromModDir(textureSource: ITextureSource): ITextureSource {
        if(textureSource.path.startsWith(__dir__)) return textureSource;
        return { name: textureSource.name, path: `${__dir__}/${textureSource.path}` } as ITextureSource;
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
        if(FileTools.isExists(`${args.result.path}${args.result.name}.png`)) return Logger.Log("File with the path, given in method \'TextureWorker.createTextureWithOverlays\', already exists, texture generation process cancelled", "TextureWorker DEBUG");
        const bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config ?? android.graphics.Bitmap.Config.ARGB_8888);
        const cvs = new android.graphics.Canvas(bmp);
        for(let i in args.overlays){
            const over = args.overlays[i];
            const tex = FileTools.ReadImage(`${over.path}${over.name}.png`);
            if(over.color){
                cvs.drawBitmap(changeBitmapColor(tex, over.color), 0, 0, null);
            } else cvs.drawBitmap(tex, 0, 0, null);
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
        if(FileTools.isExists(`${args.result.path}${args.result.name}.png`)) return Logger.Log("File with the path, given in method \'TextureWorker.paintTexture\', already exists, texture generation process cancelled", "TextureWorker DEBUG");
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
        if(FileTools.isExists(`${result.path}${result.name}.png`)) return Logger.Log("File with the path, given in method \'TextureWorker.grayscaleImage\' already exists, texture generation process cancelled", "TextureWorker DEBUG");
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