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
    TextureWorker.debugMode = false;
    /**
     * Enables or disables debug mode.
     * With debug mode disabled, if the generated texture already exists on the given path,
     * texture generation process will be skipped.
     * With debug mode enabled, new texture will generate on the given path every time.
     */
    function toggleDebugMode(debug) { TextureWorker.debugMode = debug; }
    TextureWorker.toggleDebugMode = toggleDebugMode;
    function changeBitmapColor(bitmap, color) {
        var newbmp = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
        var canvas = new android.graphics.Canvas(newbmp);
        var paint = new android.graphics.Paint();
        paint.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(color[0], color[1], color[2]), android.graphics.PorterDuff.Mode.MULTIPLY));
        canvas.drawBitmap(bitmap, 0, 0, paint);
        return newbmp;
    }
    /**
     * Returns an absolute path of given path from mod directory
     */
    function fromModDir(textureSource) {
        if (textureSource.path.startsWith(__dir__))
            return textureSource;
        return { name: textureSource.name, path: __dir__ + "/" + textureSource.path, color: textureSource.color };
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
        if (!TextureWorker.debugMode && FileTools.isExists("" + args.result.path + args.result.name + ".png"))
            return Logger.Log("File with the path, given in method \'TextureWorker.createTextureWithOverlays\', already exists, texture generation process cancelled", "TextureWorker DEBUG");
        var bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, (_a = args.bitmap.config) !== null && _a !== void 0 ? _a : android.graphics.Bitmap.Config.ARGB_8888);
        var cvs = new android.graphics.Canvas(bmp);
        for (var i in args.overlays) {
            var over = args.overlays[i];
            var tex = FileTools.ReadImage("" + over.path + over.name + ".png");
            cvs.drawBitmap(over.color ? changeBitmapColor(tex, over.color) : tex, 0, 0, null);
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
        if (!TextureWorker.debugMode && FileTools.isExists("" + args.result.path + args.result.name + ".png"))
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
        if (!TextureWorker.debugMode && FileTools.isExists("" + result.path + result.name + ".png"))
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
