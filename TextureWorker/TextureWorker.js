LIBRARY({
    name: "TextureWorker",
    version: 4,
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
 * @property {[number, number, number]} [color] - RGB color to paint the overlay
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

var HelpingFuncs = {
    rgb_to_hsv: function(r, g, b){
        r /= 255;
        g /= 255;
        b /= 255;
        let cmax = Math.max(r, g, b), cmin = Math.min(r, g, b), diff = cmax - cmin, h = -1, s = -1;
        if(cmax == cmin){ h = 0; } else if(cmax == r){
            h = (60 * ((g - b) / diff) + 360) % 360;
        } else if(cmax == g){
            h = (60 * ((b - r) / diff) + 120) % 360;
        } else if(cmax == b){
            h = (60 * ((r - g) / diff) + 240) % 360;
        };
        if(cmax == 0){ s = 0; } else { s = (diff / cmax) * 100 };
        let v = cmax * 100;
        return [h, s, v];
    },
    hsv_to_rgb: function(h, s, v){
        if(h > 360 || h < 0 || s > 100 || s < 0 || v > 100 || v < 0){
            return Logger.Log("Error in converting HSV to RGB color", "TextureWorker ERROR");
        }
        s /= 100;
        v /= 100;
        let C = s * v, X = C * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - C, r, g, b;
        if(h >= 0 && h < 60){
            r = C, g = X, b = 0;
        } else if(h >= 60 && h < 120){
            r = X, g = C, b = 0;
        } else if(h >= 120 && h < 180){
            r = 0, g = C, b = X;
        } else if(h >= 180 && h < 240){
            r = 0, g = X, b = C;
        } else if(h >= 240 && h < 300){
            r = X, g = 0, b = C;
        } else {
            r = C, g = 0, b = X;
        }
        return [
            (r + m) * 255,
            (g + m) * 255, 
            (b + m) * 255
        ];
    },
    changeBitmapColor: function(bitmap, r, g, b){
        for(let x=0; x<bitmap.getWidth(); x++){
            for(let y=0; y<bitmap.getHeight(); i++){
                let pixel = bitmap.getPixel(x, y),
                red = Color.red(pixel), green = Color.green(pixel), blue = Color.blue(pixel), alpha = Color.alpha(pixel);
                if(alpha !== 0){
                    let pixelHSV = this.rgb_to_hsv(red, green, blue), 
                        givenHSV = this.rgb_to_hsv(r, g, b),
                        finalRGB = this.hsv_to_rgb(givenHSV[0], pixelHSV[1], pixelHSV[2]);
                    bitmap.setPixel(x, y, Color.argb(alpha, finalRGB[0], finalRGB[1], finalRGB[2]));
                }
            }
        }
        return bitmap;
    }
}

var TextureWorker = {
    TEXTURE_STANDART: {width: 16, height: 16, config: Bitmap.Config.ARGB_8888},
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
            if(over.color){
                cvs.drawBitmap(HelpingFuncs.changeBitmapColor(tex, over.color[0], over.color[1], over.color[2]), 0, 0, null);
            } else cvs.drawBitmap(tex, 0, 0, null);
        }
        FileTools.WriteImage(__dir__+args.result.path+args.result.name+".png", bmp);
    },
    /**
     * Creates a new texture from given, with changed color
     * @param {Object} args - params object
     * @param {BITMAP} args.bitmap - texture bitmap object, or extureWorker.TEXTURE_STANDART (width 16, height 16, config ARGB_8888)
     * @param {TEXTURE} args.src - source texture
     * @param {[r: number, g: number, b: number]} [args.color] - RGB color to paint the texture
     * @param {TEXTURE} args.result - result texture
     * @returns {void}
     */
    paintTexture: function(args){
        const bmp = new Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config || Bitmap.Config.ARGB_8888);
        const cvs = new Canvas(bmp);
        let tex = FileTools.ReadImage(__dir__+args.src.path+args.src.name+".png");
        cvs.drawBitmap(HelpingFuncs.changeBitmapColor(tex, args.color[0], args.color[1], args.color[2]), 0, 0, null);
        FileTools.WriteImage(__dir__+args.result.path+args.result.name+".png", bmp);
    },
    /**
     * Creates a new texture, rotated from given
     * @param {*} bitmap - android.graphics.Bitmap object of your texture. Can be returned from FileTools.ReadImage
     * @param {number} angle - rotation angle
     * @param {Object} result - result texture path and name without .png
     * @param {string} result.path - path to the result texture folder from mod directory
     * @param {string} result.name - name of the result texture without .png
     * @returns {void}
     */
    rotateTexture: function(bitmap, angle, result){
        const matrix = new android.graphics.Matrix();
        matrix.postRotate(angle);
        const bmp = new Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
        FileTools.WriteImage(__dir__+result.path+result.name+".png", bmp);
    }
}

EXPORT("Color", Color);
EXPORT("Bitmap", Bitmap);
EXPORT("Canvas", Canvas);
EXPORT("Paint", Paint);
EXPORT("ColorFilter", ColorFilter);
EXPORT("PorterDuff", PorterDuff);
EXPORT("TextureWorker", TextureWorker);
