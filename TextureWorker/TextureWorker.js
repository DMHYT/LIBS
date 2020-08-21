LIBRARY({
    name: "TextureWorker",
    version: 1,
    shared: false,
    api: "CoreEngine"
});

//by vstannumdum
//VK - https://www.vk.com/vstannumdum
//VK Public - https://www.vk.com/dmhmods

const Color = android.graphics.Color;
const Bitmap = android.graphics.Bitmap;
const Canvas = android.graphics.Color;
const Paint = android.graphics.Paint;
const ColorFilter = android.graphics.PorterDuffColorFilter;
const PorterDuff = android.graphics.PorterDuff;

const Textures = {
    TEXTURE_STANDART: {width: 16, height: 16, config: Bitmap.Config.ARGB_8888},
    MODE_STANDART: PorterDuff.Mode.SRC_IN,
    /*
    args = {
        bitmap: {
            width: number,
            height: number,
            config: bitmap config
        } or Textures.TEXTURE_STANDART,
        overlays: [
            {
                paint: {
                    color: [int r, int g, int b],
                    mode: your PorterDuffMode or Textures.MODE_STANDART
                },
                path: path to texture folder from the root mod directory, for ex. "assets/items-opaque/",
                name: texture name without .png
            },
            ...
        ],
        result: {
            path: path to new texture location, for ex. "assets/items-opaque/",
            name: new texture name without .png
        }
    }
    */
    createTextureWithOverlays: function(args){
        const bmp = new Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config);
        const cvs = new Canvas(bmp);
        for(let i in args.overlays){
            let over = args.overlays[i];
            let tex = FileTools.ReadImage(__dir__+over.path+over.name+".png");
            if(over.paint){
                const pt = new Paint();
                pt.setColorFilter(new ColorFilter(Color.rgb(over.paint.color[0], over.paint.color[1], over.paint.color[2]), over.paint.mode));
                cvs.drawBitmap(tex, 0, 0, pt || null);
            }
        }
        FileTools.WriteImage(__dir__+args.result.path+args.result.name+".png", bmp);
    },
    /*
    args: {
        bitmap: {
            width: number,
            height: number,
            config: bitmap config
        } or Textures.TEXTURE_STANDART,
        src: {
            path: path to source texture from the mod directory, for ex. "assets/items-opaque",
            name: name of the source texture without .png
        },
        paint: {
            color: [int r, int g, int b],
            mode: your PorterDuffMode or Texture.MODE_STANDART
        }
        result: {
            path: path to new texture location, for ex. "assets/items-opaque",
            name: name of the new texture without .png
        }
    }
    */
    paintTexture: function(args){
        const bmp = new Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config);
        const cvs = new Canvas(bmp);
        const pt = new Paint();
        let tex = FileTools.ReadImage(__dir__+args.src.path+args.src.name+".png");
        pt.setColorFilter(new ColorFilter(Color.rgb(args.paint.color[0], args.paint.color[1], args.paint.color[2]), args.paint.mode));
        cvs.drawBitmap(tex, 0, 0, pt);
        FileTools.WriteImage(__dir__+args.result.path+args.result.name+".png", bmp);
    },
}

EXPORT("Color", Color);
EXPORT("Bitmap", Bitmap);
EXPORT("Canvas", Canvas);
EXPORT("Paint", Paint);
EXPORT("ColorFilter", ColorFilter);
EXPORT("PorterDuff", PorterDuff);
EXPORT("Textures", Textures);