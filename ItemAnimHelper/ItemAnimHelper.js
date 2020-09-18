LIBRARY({
    name: "ItemAnimHelper",
    version: 1,
    shared: false,
    api: 'CoreEngine'
});

// © vstannumdum 2020
//YouTube - DMH (Russian);
//VK - https://www.vk.com/vstannumdum
//VK Public - https://www.vk.com/dmhmods
//report the bugs in the VK public - https://www.vk.com/dmhmods


//This library was made to convert animated item textures from PC to common textures, 
//and also to make item animations for Inner Core themselves.

//Эта библиотека сделана, чтобы конвертировать текстуры анимированных предметов с ПК в обычные текстуры, 
//а также делать сами предметные анимации для Inner Core.

var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;

var IAHelper = {
    itemAnims: {},
    /**
     * Creates simple textures from given animated item texture from PC ('tall' texture)
     * @param {string} srcPath - path to the 'tall' texture from the mod directory, simple textures will be put into 'assets/items-opaque/' folder.
     * @param {string} srcName - name of the 'tall' texture without .png
     * @param {string} resultPath - location of result textures, must be "<resource_directory>/items-opaque/"
     * @param {string} resultName - name of the result textures (they will be with different meta and same name)
     * @returns {void}
     */
    convertTexture: function(srcPath, srcName, resultPath, resultName){
        const anim = FileTools.ReadImage(__dir__+srcPath+srcName+".png");
        for(let i = 0; i < anim.getHeight() / anim.getWidth(); i++){
            const bmp = new Bitmap.createBitmap(anim.getWidth(), anim.getWidth(), Bitmap.Config.ARGB_8888);
            const cvs = new Canvas(bmp);
            const colors = [];
            anim.getPixels(colors, 0, anim.getWidth(), 0, anim.getWidth() * i, anim.getWidth(), anim.getWidth());
            const bm = new Bitmap.createBitmap(colors, anim.getWidth(), anim.getWidth(), Bitmap.Config.ARGB_8888);
            cvs.drawBitmap(bm, 0, 0, null);
            FileTools.WriteImage(__dir__+resultPath+resultName+"_"+i);
        }
    },
    /**
     * Item texture will animate according to interval in ticks
     * @param {number} id - id of the item you want to animate
     * @param {string} textureName - name of your item's texture (you were putting it as resultName in 'convertTexture' function)
     * @param {number} ticks - how many ticks must pass between changing item texture animation frame
     * @param {number} frames - how many frames has the item texture animation
     * @returns {void}
     */
    makeCommonAnim: function(id, textureName, ticks, frames){
        if(!obj){
            //
            //
            obj = {meta: 0, timer: 0};
            Callback.addCallback("tick", function(){
                if(obj.timer + 1 == ticks){
                    if(obj.meta < frames){
                        obj.meta++;
                    } else obj.meta = 0;
                }
                if(obj.timer < ticks){
                    obj.timer++;
                } else { obj.timer = 0; }
            });
            Item.registerIconOverrideFunction(id, function(item, name){
                return {
                    name: textureName,
                    meta: IAHelper.itemAnims[textureName].meta
                }
            });
            //
            //
        } else return Logger.Log("An error occured calling \'IAHelper.makeCommonAnim\' method. Another animation is already registered.", "ItemAnimHelper ERROR");
    },
    /**
     * Item texture will animate according to the array of different intervals in ticks
     * @param {number} id - id of the item you want to animate
     * @param {string} textureName - name of your item's texture (you were putting it as resultName in 'convertTexture' function)
     * @param {number} frames - how many frames has the item texture animation
     * @param {number[]} intervals - set of different intervals between which will animate the texture
     * @returns {void}
     */
    makeAdvancedAnim: function(id, textureName, frames, intervals){
        let obj = this.itemAnims[textureName];
        if(!obj){
            //
            //
            obj = {meta: 0, timer: 0, interval: 0};
            Callback.addCallback("tick", function(){
                if(obj.interval == intervals.length){ obj.interval = 0; }
                if(obj.timer >= intervals[obj.interval]){
                    if(obj.meta < frames){
                        obj.meta++;
                    } else obj.meta == 0;
                }
                if(obj.timer < intervals[obj.interval]){
                    obj.timer++;
                } else { obj.timer = 0; obj.interval++; }
            });
            Item.registerIconOverrideFunction(id, function(item, name){
                return {
                    name: textureName,
                    meta: IAHelper.itemAnims[textureName].meta
                }
            });
            //
            //
        } else return Logger.Log("An error occured calling \'IAHelper.makeAdvancedAnim\' method. Another animation is already registered.", "ItemAnimHelper ERROR");
    }
}

EXPORT("IAHelper", IAHelper);