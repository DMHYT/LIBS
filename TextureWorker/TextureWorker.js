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

const TextureWorker = {
    TEXTURE_STANDART: {width: 16, height: 16, config: Bitmap.Config.ARGB_8888},
    MODE_STANDART: PorterDuff.Mode.SRC_IN,
    /*
    args = {
        bitmap: {
            width: number,
            height: number,
            config: bitmap config
        } or TextureWorker.TEXTURE_STANDART,
        src: {
            paint: {
                color: [int r, int g, int b],
                mode: your PorterDuffMode or TextureWorker.MODE_STANDART
            },
            path: path to source texture folder from the mod directory, for ex. "assets/items-opaque/",
            name: source texture name without .png
        },
        overlays: [
            {
                paint: {
                    color: [int r, int g, int b],
                    mode: your PorterDuffMode or TextureWorker.MODE_STANDART
                },
                path: path to texture folder from the mod directory, for ex. "assets/items-opaque/",
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
        if(src.paint){
            const spt = new Paint();
            spt.setColorFilter(new ColorFilter(Color.rgb(args.src.paint.color[0], args.src.paint.color[1], args.src.paint.color[2]), args.src.paint.mode));
            cvs.drawBitmap(FileTools.ReadImage(__dir__+args.src.path+args.src.name+".png"), 0, 0, spt);
        } else cvs.drawBitmap(FileTools.ReadImage(__dir__+args.src.path+args.src.name+".png"), 0, 0, null);
        for(let i in args.overlays){
            let over = args.overlays[i];
            if(over.paint){
                const pt = new Paint();
                pt.setColorFilter(new ColorFilter(Color.rgb(over.paint.color[0], over.paint.color[1], over.paint.color[2]), over.paint.mode));
                cvs.drawBitmap(FileTools.ReadImage(__dir__+over.path+over.name+".png"), 0, 0, pt);
            } else cvs.drawBitmap(FileTools.ReadImage(__dir__+over.path+over.name+".png"), 0, 0, null);
        }
        FileTools.WriteImage(__dir__+args.result.path+args.result.name+".png", bmp);
    },
    /*
    args: {
        bitmap: {
            width: number,
            height: number,
            config: bitmap config
        } or TextureWorker.TEXTURE_STANDART,
        src: {
            path: path to source texture from the mod directory, for ex. "assets/items-opaque",
            name: name of the source texture without .png
        },
        paint: {
            color: [int r, int g, int b],
            mode: your PorterDuffMode or TextureWorker.MODE_STANDART
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
EXPORT("TextureWorker", TextureWorker);