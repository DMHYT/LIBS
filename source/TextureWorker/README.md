## **TextureWorker**
TextureWorker is a library to work with bitmaps / textures
***
### **Using TextureWorker method**
#### **Initialization**
To start working you must import the library.
```js
IMPORT("TextureWorker");
```
***

#### **Texture overlays**
```js
TextureWorker.createTextureWithOverlays({
  bitmap: {
    width: 16,
    height: 16,
    config: Bitmap.Config.ARGB_8888
  },
  overlays: [
    {
      color: [255, 0, 255],
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
##### **Params object**
```js
{
  bitmap: {
    //texture width in pixels
    width: 16,
    //texture height in pixels
    height: 16,
    //android.graphics.Bitmap.Config for the texture or TextureWorker.TEXTURE_STANDART (it's config ARGB_8888)
    config: Bitmap.Config.ARGB_8888
  },
  overlays: [
    {
      //painting the overlay in another color (optional)
      //color to change texture [r, g, b]
      color: [255, 0, 255],
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
TextureWorker.paintTexture({
  bitmap: {
    width: 16,
    height: 16,
    config: Bitmap.Config.ARGB_8888
  },
  src: {
    path: "assets/items-opaque/",
    name: "myTexture_0",
  },
  color: [255, 0, 255],
  result: {
    path: "assets/items-opaque/",
    name: "myPaintedTexture_0"
  }
});
```
Creates new texture with changed color.
##### **Params object**
```js
{
  bitmap: {
    //texture width in pixels
    width: 16,
    //texture height in pixels
    height: 16,
    //android.graphics.Bitmap.Config for the texture or TextureWorker.TEXTURE_STANDART (it's config ARGB_8888)
    config: Bitmap.Config.ARGB_8888
  },
  src: {
    //path to source texture from mod directory
    path: "assets/items-opaque/",
    //name of the source texture without .png
    name: "myTexture_0",
  },
  //color to change texture [r, g, b]
  color: [255, 0, 255],
  result: {
    //path to new texture's folder from the mod directory
    path: "assets/items-opaque/",
    //new texture name without .png
    name: "myPaintedTexture_0"
  }
}
```
***

#### **Rotating the texture (V4)**
```js
TextureWorker.rotateTexture(
  //android.graphics.Bitmap object of the source texture, can be returned by the FileTools.ReadImage method
  FileTools.ReadImage(__dir__+"assets/terrain-atlas/myTexture_0.png"),
  //rotation angle
  90,
  //new texture path and name without .png
  {
    path: "assets/terrain-atlas/",
    name: "myRotatedTexture_0"
  }
);
```
Creates a new texture, rotated from given.

***
### **Downloading the documentation (for Visual Studio Code hints)**
#### - Go to your mod project folder
#### - Move TextureWorker.d.ts to toolchain/jslibs/
#### - Do any task that builds the mod, to update documentation
***
### **INFO**
#### This is the first version of this library, and it has only 3 methods. You can propose new useful methods for textures in VK, and also you can propose your ideas about improvement of library's convenience and customization.
#### [My VK Public](https://www.vk.com/dmhmods)
#### [My VK](https://www.vk.com/vstannumdum)
***
###### © vstannumdum 2020