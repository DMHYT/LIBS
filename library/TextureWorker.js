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
var TextureWorker;
(function (TextureWorker) {
    function rgb_to_hsv(r, g, b) {
        var h, s, v;
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b), c = max - min;
        if (c == 0)
            h = 0;
        else if (max == r)
            h = ((g - b) / c) % 6;
        else if (max == g)
            h = (b - r) / c + 2;
        else
            h = (r - g) / c + 4;
        h *= 60;
        if (h < 0)
            h += 360;
        v = max;
        if (v == 0)
            s = 0;
        else
            s = c / v;
        s *= 100, v *= 100;
        return [h, s, v];
    }
    function hsv_to_rgb(h, s, v) {
        if (h >= 360)
            h = 359;
        if (s > 100)
            s = 100;
        if (v > 100)
            v = 100;
        s /= 100.0, v /= 100.0;
        var c = v * s, hh = h / 60.0, x = c * (1.0 - Math.abs((hh % 2) - 1.0)), r = 0, g = 0, b = 0;
        if (hh >= 0 && h < 2)
            r = c, g = x;
        else if (hh >= 1 && hh < 2)
            r = x, g = c;
        else if (hh >= 2 && hh < 3)
            g = c, b = x;
        else if (hh >= 3 && hh < 4)
            g = x, b = c;
        else if (hh >= 4 && hh < 5)
            r = x, b = c;
        else
            r = c, b = x;
        var m = v - c;
        r += m, g += m, b += m,
            r *= 255.0, g *= 255.0, b *= 255.0,
            r = Math.round(r), g = Math.round(g), b = Math.round(b);
        return [r, g, b];
    }
    function changeBitmapColor(bitmap, color) {
        var newbmp = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
        for (var x = 0; x < bitmap.getWidth(); ++x) {
            for (var y = 0; y < bitmap.getHeight(); ++y) {
                var px = bitmap.getPixel(x, y), r = android.graphics.Color.red(px), g = android.graphics.Color.green(px), b = android.graphics.Color.blue(px);
                var customHSV = rgb_to_hsv(color[0], color[1], color[2]), pixelHSV = rgb_to_hsv(r, g, b), finalRGB = hsv_to_rgb(customHSV[0], pixelHSV[1], pixelHSV[2]);
                newbmp.setPixel(x, y, android.graphics.Color.argb(android.graphics.Color.alpha(px), finalRGB[0], finalRGB[1], finalRGB[2]));
            }
        }
        return newbmp;
    }
    /**
     * Returns an absolute path of given path from mod directory
     */
    function fromModDir(textureSource) {
        if (textureSource.path.startsWith(__dir__))
            return textureSource;
        return { name: textureSource.name, path: __dir__ + "/" + textureSource.path };
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
        var _a;
        if (FileTools.isExists("" + args.result.path + args.result.name + ".png"))
            return Logger.Log("File with the path, given in method \'TextureWorker.createTextureWithOverlays\', already exists, texture generation process cancelled", "TextureWorker DEBUG");
        var bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, (_a = args.bitmap.config) !== null && _a !== void 0 ? _a : android.graphics.Bitmap.Config.ARGB_8888);
        var cvs = new android.graphics.Canvas(bmp);
        for (var i in args.overlays) {
            var over = args.overlays[i];
            var tex = FileTools.ReadImage("" + over.path + over.name + ".png");
            if (over.color) {
                cvs.drawBitmap(changeBitmapColor(tex, over.color), 0, 0, null);
            }
            else
                cvs.drawBitmap(tex, 0, 0, null);
        }
        FileTools.WriteImage("" + args.result.path + args.result.name + ".png", bmp);
        if (fallback)
            return bmp;
    }
    TextureWorker.createTextureWithOverlays = createTextureWithOverlays;
    /**
     * Creates a new texture from given, with changed color
     * @param args params object
     * @param fallback whether to return final texture bitmap object after process
     * @returns void or bitmap object if fallback is true
     */
    function paintTexture(args, fallback) {
        var _a;
        if (FileTools.isExists("" + args.result.path + args.result.name + ".png"))
            return Logger.Log("File with the path, given in method \'TextureWorker.paintTexture\', already exists, texture generation process cancelled", "TextureWorker DEBUG");
        var bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, (_a = args.bitmap.config) !== null && _a !== void 0 ? _a : android.graphics.Bitmap.Config.ARGB_8888);
        var cvs = new android.graphics.Canvas(bmp);
        cvs.drawBitmap(changeBitmapColor(FileTools.ReadImage("" + args.src.path + args.src.name + ".png"), args.color), 0, 0, null);
        FileTools.WriteImage("" + args.result.path + args.result.name + ".png", bmp);
        if (fallback)
            return bmp;
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
        if (FileTools.isExists("" + result.path + result.name + ".png"))
            return Logger.Log("File with the path, given in method \'TextureWorker.grayscaleImage\' already exists, texture generation process cancelled", "TextureWorker DEBUG");
        var source = FileTools.ReadImage("" + src.path + src.name + ".png");
        var output = android.graphics.Bitmap.createBitmap(source.getWidth(), source.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
        var cvs = new android.graphics.Canvas(output);
        var paint = new android.graphics.Paint();
        var matrix = new android.graphics.ColorMatrix();
        matrix.setSaturation(0);
        paint.setColorFilter(new android.graphics.ColorMatrixColorFilter(matrix));
        cvs.drawBitmap(source, 0, 0, paint);
        FileTools.WriteImage("" + result.path + result.name + ".png", output);
        if (fallback)
            return output;
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
