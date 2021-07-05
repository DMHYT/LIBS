/// <reference path="../../declarations/core-engine.d.ts" />
/*
██╗████████╗███████╗███╗   ███╗ █████╗ ███╗  ██╗██╗███╗   ███╗██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗
██║╚══██╔══╝██╔════╝████╗ ████║██╔══██╗████╗ ██║██║████╗ ████║██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗
██║   ██║   █████╗  ██╔████╔██║███████║██╔██╗██║██║██╔████╔██║███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝
██║   ██║   ██╔══╝  ██║╚██╔╝██║██╔══██║██║╚████║██║██║╚██╔╝██║██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗
██║   ██║   ███████╗██║ ╚═╝ ██║██║  ██║██║ ╚███║██║██║ ╚═╝ ██║██║  ██║███████╗███████╗██║     ███████╗██║  ██║
╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚══╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝
*/
LIBRARY({
    name: "ItemAnimHelper",
    version: 2,
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
var IAHelper;
(function (IAHelper) {
    IAHelper.itemAnims = {};
    /**
     * Creates simple textures from given animated item texture from PC ('tall' texture)
     * @param srcPath path to the 'tall' texture from the mod directory, simple textures will be put into 'assets/items-opaque/' folder.
     * @param srcName name of the 'tall' texture without .png
     * @param resultPath location of result textures, must be "<resource_directory>/items-opaque/"
     * @param resultName name of the result textures (they will be with different meta and same name)
     */
    function convertTexture(srcPath, srcName, resultPath, resultName) {
        var anim = FileTools.ReadImage(__dir__ + "/" + srcPath + srcName + ".png");
        for (var i = 0; i < anim.getHeight() / anim.getWidth(); i++) {
            var bmp = android.graphics.Bitmap.createBitmap(anim.getWidth(), anim.getWidth(), android.graphics.Bitmap.Config.ARGB_8888);
            var cvs = new android.graphics.Canvas(bmp);
            var bmp2 = anim.copy(anim.getConfig(), true);
            cvs.drawBitmap(bmp2, 0, 0, null);
            FileTools.WriteImage(__dir__ + "/" + resultPath + resultName + "_" + i + ".png", bmp);
        }
    }
    IAHelper.convertTexture = convertTexture;
    /**
     * Item texture will animate according to interval in ticks
     * @param id id of the item you want to animate
     * @param textureName name of your item's texture (you were putting it as resultName in 'convertTexture' function)
     * @param ticks how many ticks must pass between changing item texture animation frame
     * @param frames how many frames has the item texture animation
     */
    function makeCommonAnim(id, textureName, ticks, frames) {
        var obj = IAHelper.itemAnims[textureName];
        if (typeof obj === "undefined") {
            obj = { meta: 0, timer: 0 };
            Callback.addCallback("LocalTick", function () {
                if (obj.timer + 1 == ticks) {
                    if (obj.meta < frames)
                        obj.meta++;
                    else
                        obj.meta = 0;
                }
                if (obj.timer < ticks)
                    obj.timer++;
                else
                    obj.timer = 0;
            });
            Item.registerIconOverrideFunction(id, function (item, isModUi) {
                return {
                    name: textureName,
                    data: IAHelper.itemAnims[textureName].meta
                };
            });
        }
        else
            return Logger.Log("An error occured calling 'ItemAnimHelper.makeCommonAnim' method. Another animation is already bound to item '" + Item.getName(id, 0) + "'", "ItemAnimHelper ERROR");
    }
    IAHelper.makeCommonAnim = makeCommonAnim;
    /**
     * Item texture will change its frames according to frame numbers array which you will specify
     * @param id id of the item you want to animate
     * @param textureName name of your item's texture (you were putting it as resultName in 'convertTexture' function)
     * @param interval interval between which the texture will change its frame
     * @param frames frames that will texture be being changed to every update interval
     * @param intervals set of different intervals between which will animate the texture
     */
    function makeAdvancedAnim(id, textureName, interval, frames) {
        var obj = IAHelper.itemAnims[textureName];
        if (typeof obj === "undefined") {
            obj = { meta: 0, timer: 0, frameIndex: 0 };
            Callback.addCallback("LocalTick", function () {
                if (obj.timer + 1 == interval) {
                    if (obj.frameIndex < frames.length)
                        obj.frameIndex++;
                    else
                        obj.frameIndex = 0;
                    obj.meta = frames[obj.frameIndex];
                }
                if (obj.timer < interval)
                    obj.timer++;
                else
                    obj.timer = 0;
            });
            Item.registerIconOverrideFunction(id, function (item, imu) {
                return {
                    name: textureName,
                    data: IAHelper.itemAnims[textureName].meta
                };
            });
        }
        else
            return Logger.Log("An error occured calling 'IAHelper.makeAdvancedAnim' method. Another animation is already bound to item '" + Item.getName(id, 0) + "'.", "ItemAnimHelper ERROR");
    }
    IAHelper.makeAdvancedAnim = makeAdvancedAnim;
})(IAHelper || (IAHelper = {}));
EXPORT("IAHelper", IAHelper);
