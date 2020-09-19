LIBRARY({
    name: "TextureWorker",
    version: 2,
    shared: false,
    api: "CoreEngine"
});

//by vstannumdum
//VK - https://www.vk.com/vstannumdum
//VK Public - https://www.vk.com/dmhmods

var Color = android.graphics.Color;
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Paint = android.graphics.Paint;
var ColorFilter = android.graphics.PorterDuffColorFilter;
var PorterDuff = android.graphics.PorterDuff;

/**
 * @typedef {Object} OVERLAY - texture overlay object
 * @property {Object} [paint] - settings to paint the overlay in another color
 * @property {[number, number, number]} paint.color - RGB color to paint the overlay
 * @property {*} paint.mode - android.graphics.PorterDuff.Mode or TextureWorker.MODE_STANDART (it's SRC_IN)
 * @property {string} path - path to the overlay from mod directory
 * @property {string} name - name of the overlay without .png
 */

/**
 * @typedef {Object} TEXTURE - texture object
 * @property {string} path - path to the texture from mod directory
 * @property {string} name - name of the texture without .png
 */

 /**
  * @typedef {Object} BITMAP - bitmap object
  * @property {number} width - bitmap width
  * @property {number} height - bitmap height
  * @property {*} [config] - android.graphics.Bitmap.Config, default is ARGB_8888
  */

var TextureWorker = {
    TEXTURE_STANDART: {width: 16, height: 16, config: Bitmap.Config.ARGB_8888},
    MODE_STANDART: PorterDuff.Mode.SRC_IN,
    /**
     * Creates a new texture on the specified path, from other textures, with possibility of painting each overlay into specified color.
     * @param {Object} args - params object 
     * @param {BITMAP} args.bitmap - bitmap object, or TextureWorker.TEXTURE_STANDART (width 16, height 16, config ARGB_8888)
     * @param {OVERLAY[]} args.overlays - array of the overlays, situated in the order of their overlaying above each other.
     * @param {TEXTURE} args.result - result texture name and path object
     * @returns {void} - creates a new texture and returns void
     */
    createTextureWithOverlays: function(args){
        const bmp = new Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config || Bitmap.Config.ARGB_8888);
        const cvs = new Canvas(bmp);
        for(let i in args.overlays){
            let over = args.overlays[i];
            let tex = FileTools.ReadImage(__dir__+over.path+over.name+".png");
            if(over.paint){
                const pt = new Paint();
                pt.setColorFilter(new ColorFilter(Color.rgb(args.paint.color[0], args.paint.color[1], args.paint.color[2]), over.paint.mode || PorterDuff.Mode.SRC_IN));
                cvs.drawBitmap(tex, 0, 0, pt);
            } else cvs.drawBitmap(tex, 0, 0, null);
        }
        FileTools.WriteImage(__dir__+args.result.path+args.result.name+".png", bmp);
    },
    /**
     * Creates a new texture from given, with changed color
     * @param {Object} args - params object
     * @param {BITMAP} args.bitmap - texture bitmap object, or extureWorker.TEXTURE_STANDART (width 16, height 16, config ARGB_8888)
     * @param {TEXTURE} args.src - source texture
     * @param {Object} args.paint - settings to paint the source texture
     * @param {[r: number, g: number, b: number]} args.paint.color - RGB color to paint the texture
     * @param {*} args.paint.mode - android.graphics.PorterDuff.Mode or TextureWorker.MODE_STANDART (it's SRC_IN)
     * @param {TEXTURE} args.result - result texture
     */
    paintTexture: function(args){
        const bmp = new Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config || Bitmap.Config.ARGB_8888);
        const cvs = new Canvas(bmp);
        const pt = new Paint();
        let tex = FileTools.ReadImage(__dir__+args.src.path+args.src.name+".png");
        pt.setColorFilter(new ColorFilter(Color.rgb(args.paint.color[0], args.paint.color[1], args.paint.color[2]), args.paint.mode || PorterDuff.Mode.SRC_IN));
        cvs.drawBitmap(tex, 0, 0, pt);
        FileTools.WriteImage(__dir__+args.result.path+args.result.name+".png", bmp);
    }
}

EXPORT("Color", Color);
EXPORT("Bitmap", Bitmap);
EXPORT("Canvas", Canvas);
EXPORT("Paint", Paint);
EXPORT("ColorFilter", ColorFilter);
EXPORT("PorterDuff", PorterDuff);
EXPORT("TextureWorker", TextureWorker);