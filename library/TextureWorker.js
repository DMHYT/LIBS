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
    version: 6,
    shared: false,
    api: "CoreEngine"
});
//by vstannumdum
//VK - https://www.vk.com/vstannumdum
//VK Public - https://www.vk.com/dmhmods
var TextureWorker;
(function (TextureWorker) {
    var HelpingFuncs;
    (function (HelpingFuncs) {
        function RGBToHSV(r, g, b) {
            try {
                r /= g /= b /= 255;
                var cmax = Math.max(r, g, b), cmin = Math.min(r, g, b), diff = cmax - cmin, h = -1, s = -1, v = cmax * 100;
                switch (true) {
                    case cmax == cmin:
                        h = 0;
                        break;
                    case cmax == r:
                        h = (60 * ((g - b) / diff) + 360) % 360;
                        break;
                    case cmax == g:
                        h = (60 * ((b - r) / diff) + 120) % 360;
                        break;
                    case cmax == b:
                        h = (60 * ((r - g) / diff) + 240) % 360;
                        break;
                }
                if (cmax == 0) {
                    s = 0;
                }
                else
                    s = (diff / cmax) * 100;
                return [h, s, v];
            }
            catch (e) {
                Logger.Log("Some errors occured during RGB to HSV conversion", "TextureWorker ERROR");
                if (e instanceof java.lang.Throwable)
                    Logger.LogError(e);
            }
        }
        HelpingFuncs.RGBToHSV = RGBToHSV;
        function HSVToRGB(h, s, v) {
            try {
                if (h > 360 || h < 0 || s > 100 || s < 0 || v > 100 || v < 0) {
                    return Logger.Log("Error in converting HSV to RGB color", "TextureWorker ERROR");
                }
                s /= v /= 100;
                var C = s * v, X = C * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - C, r = void 0, g = void 0, b = void 0;
                switch (true) {
                    case h >= 0 && h < 60:
                        r = C, g = X, b = 0;
                        break;
                    case h >= 60 && h < 120:
                        r = X, g = C, b = 0;
                        break;
                    case h >= 120 && h < 180:
                        r = 0, g = C, b = X;
                        break;
                    case h >= 180 && h < 240:
                        r = 0, g = X, b = C;
                        break;
                    case h >= 240 && h < 300:
                        r = X, g = 0, b = C;
                        break;
                    default:
                        r = C, g = 0, b = X;
                }
                return [
                    (r + m) * 255,
                    (g + m) * 255,
                    (b + m) * 255
                ];
            }
            catch (e) {
                Logger.Log("Some errors occured during HSV to RGB conversion", "TextureWorker ERROR");
                if (e instanceof java.lang.Throwable)
                    Logger.LogError(e);
            }
        }
        HelpingFuncs.HSVToRGB = HSVToRGB;
        function changeBitmapColor(bitmap, r, g, b) {
            try {
                var newBmp = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), bitmap.getConfig());
                for (var x = 0; x < bitmap.getWidth(); x++) {
                    for (var y = 0; y < bitmap.getHeight(); y++) {
                        var px = bitmap.getPixel(x, y), red = android.graphics.Color.red(px), green = android.graphics.Color.green(px), blue = android.graphics.Color.blue(px), alpha = android.graphics.Color.alpha(px);
                        if (alpha !== 0) {
                            var pixelHSV = RGBToHSV(red, green, blue), givenHSV = RGBToHSV(r, g, b), finalRGB = HSVToRGB(givenHSV[0], pixelHSV[1], pixelHSV[2]);
                            newBmp.setPixel(x, y, android.graphics.Color.argb(alpha, finalRGB[0], finalRGB[1], finalRGB[2]));
                        }
                    }
                }
                return newBmp;
            }
            catch (e) {
                Logger.Log("Some errors occured during changing bitmap color", "TextureWorker ERROR");
                if (e instanceof java.lang.Throwable)
                    Logger.LogError(e);
            }
        }
        HelpingFuncs.changeBitmapColor = changeBitmapColor;
        function toGrayscale(bitmap) {
            try {
                var grayscaled = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
                var c = new android.graphics.Canvas(grayscaled);
                var paint = new android.graphics.Paint();
                var cm = new android.graphics.ColorMatrix();
                cm.setSaturation(0);
                var f = new android.graphics.ColorMatrixColorFilter(cm);
                paint.setColorFilter(f);
                c.drawBitmap(bitmap, 0, 0, paint);
                return grayscaled;
            }
            catch (e) {
                Logger.Log("Somer errors occured during grayscaling a bitmap", "TextureWorker ERROR");
                if (e instanceof java.lang.Throwable)
                    Logger.LogError(e);
            }
        }
        HelpingFuncs.toGrayscale = toGrayscale;
    })(HelpingFuncs || (HelpingFuncs = {}));
    /**
     * Returns an absolute path of given path from mod directory
     */
    function fromModDir(textureSource) {
        if (textureSource.path.startsWith(__dir__))
            return textureSource;
        return {
            name: textureSource.name,
            path: __dir__ + "/" + textureSource.path
        };
    }
    TextureWorker.fromModDir = fromModDir;
    /**
     * default for most of minecraft mods texture settings,
     * 16x16 size and ARGB_8888 config
     */
    TextureWorker.TEXTURE_STANDART = { width: 16, height: 16, config: android.graphics.Bitmap.Config.ARGB_8888 };
    /**
     * Creates a new texture on the specified path,
     * from other textures, with possibility
     * of painting each overlay into specified color.
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function createTextureWithOverlays(args, fallback) {
        try {
            if (FileTools.isExists(args.result.path + args.result.name + ".png")) {
                Logger.Log("File with the path, given in method \'TextureWorker.createTextureWithOverlays\', already exists, texture generation process stopped", "TextureWorker DEBUG");
                return;
            }
            var bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config || android.graphics.Bitmap.Config.ARGB_8888);
            var cvs = new android.graphics.Canvas(bmp);
            for (var i in args.overlays) {
                var over = args.overlays[i];
                var tex = FileTools.ReadImage(over.path + over.name + ".png");
                if (over.color !== null) {
                    cvs.drawBitmap(HelpingFuncs.changeBitmapColor(tex, over.color[0], over.color[1], over.color[2]), 0, 0, null);
                }
                else
                    cvs.drawBitmap(tex, 0, 0, null);
            }
            FileTools.WriteImage(args.result.path + args.result.name + ".png", bmp);
            bmp.finalize();
            cvs.finalize();
            if (fallback)
                return FileTools.ReadImage(args.result.path + args.result.name + ".png");
        }
        catch (e) {
            Logger.Log("Some errors occured while calling method \'TextureWorker.createTextureWithOverlays\'", "TextureWorker ERROR");
            if (e instanceof java.lang.Throwable)
                Logger.LogError(e);
        }
    }
    TextureWorker.createTextureWithOverlays = createTextureWithOverlays;
    /**
     * Creates a new texture from given, with changed color
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function paintTexture(args, fallback) {
        try {
            if (FileTools.isExists(args.result.path + args.result.name + ".png")) {
                Logger.Log("File with the path, given in method \'TextureWorker.paintTexture\', already exists, texture generation process stopped", "TextureWorker DEBUG");
                return;
            }
            var bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config || android.graphics.Bitmap.Config.ARGB_8888);
            var cvs = new android.graphics.Canvas(bmp);
            var tex = FileTools.ReadImage(args.src.path + args.src.name + ".png");
            cvs.drawBitmap(HelpingFuncs.changeBitmapColor(tex, args.color[0], args.color[1], args.color[2]), 0, 0, null);
            FileTools.WriteImage(args.result.path + args.result.name + ".png", bmp);
            bmp.finalize();
            cvs.finalize();
            tex.finalize();
            if (fallback)
                return FileTools.ReadImage(args.result.path + args.result.name + ".png");
        }
        catch (e) {
            Logger.Log("Some errors occured while calling method \'TextureWorker.paintTexture\'", "TextureWorker ERROR");
            if (e instanceof java.lang.Throwable)
                Logger.LogError(e);
        }
    }
    TextureWorker.paintTexture = paintTexture;
    /**
     * Creates a grayscaled texture from given
     * @param src source texture path and name
     * @param result result texture path and name
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function grayscaleImage(src, result, fallback) {
        try {
            if (FileTools.isExists(result.path + result.name + ".png")) {
                Logger.Log("File with the path, given in method \'TextureWorker.grayscaleImage\' already exists, texture generation process stopped", "TextureWorker DEBUG");
                return;
            }
            var grayscaled = HelpingFuncs.toGrayscale(FileTools.ReadImage(src.path + src.name + ".png"));
            FileTools.WriteImage(result.path + result.name + ".png", grayscaled);
            if (fallback)
                return grayscaled;
        }
        catch (e) {
            Logger.Log("Some errors occured while calling method \'TextureWorker.grayscaleImage\'", "TextureWorker ERROR");
            if (e instanceof java.lang.Throwable)
                Logger.LogError(e);
        }
    }
    TextureWorker.grayscaleImage = grayscaleImage;
    /**
     * Same as [[TextureWorker.createTextureWithOverlays]],
     * but gets given pathes not as absolute pathes, but as pathes
     * from the mod directory
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function createTextureWithOverlaysModDir(args, fallback) {
        args.result = fromModDir(args.result);
        for (var i in args.overlays)
            args.overlays[i] = fromModDir(args.overlays[i]);
        return createTextureWithOverlays(args, fallback);
    }
    TextureWorker.createTextureWithOverlaysModDir = createTextureWithOverlaysModDir;
    /**
     * Same as [[TextureWorker.paintTexture]],
     * but gets given pathes not as absolute pathes, but as pathes
     * from the mod directory
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function paintTextureModDir(args, fallback) {
        args.src = fromModDir(args.src);
        args.result = fromModDir(args.result);
        return paintTexture(args, fallback);
    }
    TextureWorker.paintTextureModDir = paintTextureModDir;
    /**
     * Same as [[TextureWorker.grayscaleImage]],
     * but gets given pathes not as absolute pathes, but as pathes
     * from the mod directory
     * @param src source texture path and name
     * @param result result texture path and name
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function grayscaleImageModDir(src, result, fallback) {
        src = fromModDir(src);
        result = fromModDir(result);
        return grayscaleImage(src, result, fallback);
    }
    TextureWorker.grayscaleImageModDir = grayscaleImageModDir;
})(TextureWorker || (TextureWorker = {}));
EXPORT("TextureWorker", TextureWorker);
