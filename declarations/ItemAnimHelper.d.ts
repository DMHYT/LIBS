/// <reference path="core-engine.d.ts" />
declare namespace IAHelper {
    var debugMode: boolean;
    /**
     * Enables or disables debug mode.
     * With debug mode disabled, if the generated texture frame already exists on the given path,
     * the generation process will be skipped.
     * With debug mode enabled, new texture will generate on the given path every time.
     */
    function toggleDebugMode(debug: boolean): void;
    interface IAnimTicker {
        meta: number;
        timer: number;
        frameIndex?: number;
    }
    const itemAnims: {
        [key: string]: IAnimTicker;
    };
    /**
     * Creates simple textures from given animated item texture from PC ('tall' texture)
     * @param srcPath path to the 'tall' texture from the mod directory, simple textures will be put into 'assets/items-opaque/' folder.
     * @param srcName name of the 'tall' texture without .png
     * @param resultPath location of result textures, must be "<resource_directory>/items-opaque/"
     * @param resultName name of the result textures (they will be with different meta and same name)
     */
    function convertTexture(srcPath: string, srcName: string, resultPath: string, resultName: string): void;
    /**
     * Item texture will animate according to interval in ticks
     * @param id id of the item you want to animate
     * @param textureName name of your item's texture (you were putting it as resultName in 'convertTexture' function)
     * @param ticks how many ticks must pass between changing item texture animation frame
     * @param frames how many frames has the item texture animation
     */
    function makeCommonAnim(id: number, textureName: string, ticks: number, frames: number): void;
    /**
     * Item texture will change its frames according to frame numbers array which you will specify
     * @param id id of the item you want to animate
     * @param textureName name of your item's texture (you were putting it as resultName in 'convertTexture' function)
     * @param interval interval between which the texture will change its frame
     * @param frames frames that will texture be being changed to every update interval
     * @param intervals set of different intervals between which will animate the texture
     */
    function makeAdvancedAnim(id: number, textureName: string, interval: number, frames: number[]): void;
}
