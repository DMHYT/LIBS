interface BITMAP {
    /**
     * bitmap width
     */
    width: number,
    /**
     * bitmap height
     */
    height: number,
    /**
     * android.graphics.Bitmap.Config, default is ARGB_8888
     */
    config?: any
}

interface TEXTURE {
    /**
     * path to the texture from mod directory
     * @example "assets/items-opaque/"
     */
    path: string,
    /**
     * name of the texture without .png
     * @example "myTexture_0"
     */
    name: string
}

interface OVERLAY {
    /**
     * RGB color to paint the overlay
     * @example [255, 0, 255]
     */
    color?: [r: number, g: number, b: number]
    /**
     * path to the texture from mod directory
     * @example "assets/items-opaque/"
     */
    path: string,
    /**
     * name of the texture without .png
     * @example "myTexture_0"
     */
    name: string
}

declare namespace TextureWorker {
    /**
     * Creates a new texture on the specified path, from other textures, with possibility of painting each overlay into specified color.
     * @param args params object
     */
    function createTextureWithOverlays(args: {
        /**
         * new texture bitmap settings
         */
        bitmap: BITMAP | any,
        /**
         * array of the overlays, situated in the order of their overlaying above each other.
         */
        overlays: OVERLAY[],
        /**
         * result texture
         */
        result: TEXTURE
    }): void;

    /**
     * Creates a new texture from given, with changed color
     * @param args params object
     */
    function paintTexture(args: {
        /**
         * new texture bitmap settings
         */
        bitmap: BITMAP | any,
        /**
         * source texture
         */
        src: TEXTURE,
        /**
         * RGB color to paint the overlay
         * @example [255, 0, 255]
         */
        color: [r: number, g: number, b: number],            
        /**
         * result texture
         */
        result: TEXTURE
    }): void;

    /**
     * Creates a new texture, rotated from given
     * @param bitmap android.graphics.Bitmap object of your texture. Can be returned from FileTools.ReadImage
     * @param angle rotation angle
     * @param result result texture path and name without .png
     * @param result.path path to the result texture folder from mod directory
     * @param result.name name of the result texture without .png
     */
    function rotateTexture(bitmap: android.graphics.Bitmap, angle: number, result: TEXTURE): void;
}