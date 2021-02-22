/// <reference path="core-engine.d.ts" />
declare namespace IAHelper {
    interface IAnimTicker {
        meta: number;
        timer: number;
        interval?: number;
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
     * @param id - id of the item you want to animate
     * @param textureName - name of your item's texture (you were putting it as resultName in 'convertTexture' function)
     * @param ticks - how many ticks must pass between changing item texture animation frame
     * @param frames - how many frames has the item texture animation
     */
    function makeCommonAnim(id: number, textureName: string, ticks: number, frames: number): void;
    /**
     * Item texture will animate according to the array of different intervals in ticks
     * @param id - id of the item you want to animate
     * @param textureName - name of your item's texture (you were putting it as resultName in 'convertTexture' function)
     * @param frames - how many frames has the item texture animation
     * @param intervals - set of different intervals between which will animate the texture
     */
    function makeAdvancedAnim(id: number, textureName: string, frames: number, intervals: number[]): void;
}
