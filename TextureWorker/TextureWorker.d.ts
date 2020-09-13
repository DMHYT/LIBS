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
     * settings to paint the overlay in another color
     */
    paint?: {
        /**
         * RGB color to paint the overlay
         * @example [255, 0, 255]
         */
        color: [r: number, g: number, b: number],
        /**
         * android.graphics.PorterDuff.Mode or TextureWorker.MODE_STANDART (it's SRC_IN)
         */
        mode: any
    },
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
        paint: {
            /**
             * RGB color to paint the overlay
             * @example [255, 0, 255]
             */
            color: [r: number, g: number, b: number],
            /**
             * android.graphics.PorterDuff.Mode or TextureWorker.MODE_STANDART (it's SRC_IN)
             */
            mode: any
        },
        /**
         * result texture
         */
        result: TEXTURE
    }): void;
}