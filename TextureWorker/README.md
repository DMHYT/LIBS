## **TextureWorker**
TextureWorker is a library to work with bitmaps / textures
***
### **Using Textures method**
#### **Initialization**
To start working you must import the library.
```js
IMPORT("TextureWorker");
```


#### **Texture overlays**
```js
Textures.createTextureWithOverlays({
  bitmap: {
    width: 16,
    height: 16,
    config: Bitmap.Config.ARGB_8888
  },
  overlays: [
    {
      paint: {
        color: [255, 0, 255],
        mode: PorterDuff.Mode.SRC_IN
      },
      path: "assets/items-opaque/",
      name: "myTexture_0"
    },
    //...
  ],
  result: {
    path: "assets/items-opaque/",
    name: "myNewTexture_0"
  }
});
```
Creates new texture at following path with overlays.
##### **Arguments object**
```js
{
  bitmap: {
    //texture width in pixels
    width: 16,
    //texture height in pixels
    height: 16,
    //android.graphics.Bitmap.Config for the texture
    config: Bitmap.Config.ARGB_8888
  },
  overlays: [
    {
      //painting the overlay in another color (optional)
      paint: {
        color: [255, 0, 255], //color to change texture [r, g, b]
        mode: PorterDuff.Mode.SRC_IN //android.graphics.PorterDuff.Mode or Textures.MODE_STANDART (it is SRC_IN)
      },
      //path to texture's folder from the mod directory
      path: "assets/items-opaque/",
      //texture name without .png
      name: "myTexture_0"
    },
    //another objects same as above
  ],
  result: {
    //path to new texture's folder from the mod directory
    path: "assets/items-opaque/",
    //new texture name without .png
    name: "myNewTexture_0"
  }
}
```
