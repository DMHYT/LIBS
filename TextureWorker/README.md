## **TextureWorker**
TextureWorker is a library to work with bitmaps / textures
***
### **Using Textures method**
#### **Initialization**
To start working you must import the library.
```js
IMPORT("TextureWorker");
```
***

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
    //android.graphics.Bitmap.Config for the texture or Textures.TEXTURE_STANDART (it's config ARGB_8888)
    config: Bitmap.Config.ARGB_8888
  },
  overlays: [
    {
      //painting the overlay in another color (optional)
      paint: {
        //color to change texture [r, g, b]
        color: [255, 0, 255], 
        //android.graphics.PorterDuff.Mode or Textures.MODE_STANDART (it is SRC_IN)
        mode: PorterDuff.Mode.SRC_IN 
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
***

#### **Painting the texture**
```js
Textures.paintTexture({
  bitmap: {
    width: 16,
    height: 16,
    config: Bitmap.Config.ARGB_8888
  },
  src: {
    path: "assets/items-opaque/",
    name: "myTexture_0",
  },
  paint: {
    color: [255, 0, 255],
    mode: PorterDuff.Mode.SRC_IN
  },
  result: {
    path: "assets/items-opaque/",
    name: "myPaintedTexture_0"
  }
});
```
Creates new texture with changed color.
##### **Arguments object**
```js
{
  bitmap: {
    //texture width in pixels
    width: 16,
    //texture height in pixels
    height: 16,
    //android.graphics.Bitmap.Config for the texture or Textures.TEXTURE_STANDART (it's config ARGB_8888)
    config: Bitmap.Config.ARGB_8888
  },
  src: {
    //path to source texture from mod directory
    path: "assets/items-opaque/",
    //name of the source texture without .png
    name: "myTexture_0",
  },
  paint: {
    //color to change texture [r, g, b]
    color: [255, 0, 255],
    //android.graphics.PorterDuff.Mode or Textures.MODE_STANDART (it is SRC_IN)
    mode: PorterDuff.Mode.SRC_IN
  },
  result: {
    //path to new texture's folder from the mod directory
    path: "assets/items-opaque/",
    //new texture name without .png
    name: "myPaintedTexture_0"
  }
}
```
***
### **INFO**
#### This is the first version of this library, and it has only 2 methods. You can propose new useful methods for textures in VK.
#### [My VK Public](https://www.vk.com/dmhmods)
#### [My VK](https://www.vk.com/vstannumdum)
***
###### © vstannumdum 2020
