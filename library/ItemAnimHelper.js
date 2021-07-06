LIBRARY({
    name: "ItemAnimHelper",
    version: 2,
    shared: false,
    api: 'CoreEngine'
});
var IAHelper;
(function (IAHelper) {
    IAHelper.itemAnims = {};
    function convertTexture(srcPath, srcName, resultPath, resultName) {
        var anim = FileTools.ReadImage(__dir__ + "/" + srcPath + srcName + ".png");
        for (var i = 0; i < anim.getHeight() / anim.getWidth(); i++) {
            var bmp = android.graphics.Bitmap.createBitmap(anim.getWidth(), anim.getWidth(), android.graphics.Bitmap.Config.ARGB_8888);
            for (var x = 0; x < anim.getWidth(); x++) {
                for (var y = 0; y < anim.getWidth(); y++) {
                    bmp.setPixel(x, y, anim.getPixel(x, y + anim.getWidth() * i));
                }
            }
            FileTools.WriteImage(__dir__ + "/" + resultPath + resultName + "_" + i + ".png", bmp);
        }
    }
    IAHelper.convertTexture = convertTexture;
    function makeCommonAnim(id, textureName, ticks, frames) {
        if (!!IAHelper.itemAnims[textureName])
            return Logger.Log("An error occured calling 'ItemAnimHelper.makeCommonAnim' method. Another animation is already bound to item '" + Item.getName(id, 0) + "'", "ItemAnimHelper ERROR");
        IAHelper.itemAnims[textureName] = { meta: 0, timer: 0 };
        var obj = IAHelper.itemAnims[textureName];
        Callback.addCallback("LocalTick", function () {
            if (obj.timer + 1 == ticks) {
                if (obj.meta < frames - 1)
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
    IAHelper.makeCommonAnim = makeCommonAnim;
    function makeAdvancedAnim(id, textureName, interval, frames) {
        if (!!IAHelper.itemAnims[textureName])
            return Logger.Log("An error occured calling 'IAHelper.makeAdvancedAnim' method. Another animation is already bound to item '" + Item.getName(id, 0) + "'.", "ItemAnimHelper ERROR");
        IAHelper.itemAnims[textureName] = { meta: 0, timer: 0, frameIndex: 0 };
        var obj = IAHelper.itemAnims[textureName];
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
    IAHelper.makeAdvancedAnim = makeAdvancedAnim;
})(IAHelper || (IAHelper = {}));
EXPORT("IAHelper", IAHelper);
