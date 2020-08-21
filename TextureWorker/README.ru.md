## **TextureWorker**
TextureWorker - библиотека для работы с битмапами / текстурами
***
### **Использование метода TextureWorker**
#### **Инициализация**
Для того, чтобы начать работу, необходимо импортировать библиотеку.
```js
IMPORT("TextureWorker");
```
***

#### **Наложение слоя на текстуру**
```js
TextureWorker.createTextureWithOverlays({
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
Создаёт новую текстуру со слоями на указанном пути.
##### **Объект параметров**
```js
{
  bitmap: {
    //ширина текстуры в пикселях
    width: 16,
    //высота текстуры в пикселях
    height: 16,
    //android.graphics.Bitmap.Config для текстуры или TextureWorker.TEXTURE_STANDART (это тип конфига ARGB_8888)
    config: Bitmap.Config.ARGB_8888
  },
  overlays: [
    {
      //перекрашивание текстуры в другой цвет (необязательно)
      paint: {
        //цвет, на который меняется текстура [r, g, b]
        color: [255, 0, 255], 
        //android.graphics.PorterDuff.Mode или TextureWorker.MODE_STANDART (это SRC_IN)
        mode: PorterDuff.Mode.SRC_IN 
      },
      //путь к папке текстуры в директории мода
      path: "assets/items-opaque/",
      //имя текстуры без .png
      name: "myTexture_0"
    },
    //другие объекты, такие же как объект выше
  ],
  result: {
    //путь к папке новой текстуры в директории мода
    path: "assets/items-opaque/",
    //имя новой текстуры без .png
    name: "myNewTexture_0"
  }
}
```
***

#### **Перекраска текстуры**
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
Создаёт новую текстуру с изменённым цветом.
##### **Объект параметров**
```js
{
  bitmap: {
    //ширина текстуры в пикселях
    width: 16,
    //высота текстуры в пикселях
    height: 16,
    //android.graphics.Bitmap.Config ля текстуры или TextureWorker.TEXTURE_STANDART (это тип конфига ARGB_8888)
    config: Bitmap.Config.ARGB_8888
  },
  src: {
    //путь к папке исходной текстуры в директории мода
    path: "assets/items-opaque/",
    //имя исходной текстуры без .png
    name: "myTexture_0",
  },
  paint: {
    //цвет, в который перекрасить текстуру [r, g, b]
    color: [255, 0, 255],
    //android.graphics.PorterDuff.Mode или TextureWorker.MODE_STANDART (это SRC_IN)
    mode: PorterDuff.Mode.SRC_IN
  },
  result: {
    //путь к папке новой текстуры в директории мода
    path: "assets/items-opaque/",
    //имя новой текстуры без .png
    name: "myPaintedTexture_0"
  }
}
```
***
### **ИНФОРМАЦИЯ**
#### Это первая версия этой библиотеки, имеющая всего 2 метода. Вы можете предложить свои полезные методы для текстур в ВК.
#### [Моя группа ВК](https://www.vk.com/dmhmods)
#### [Мой ВК](https://www.vk.com/vstannumdum)
***
###### © vstannumdum 2020
