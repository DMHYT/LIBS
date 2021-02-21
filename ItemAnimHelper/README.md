## **ItemAnimHelper**
ItemAnimHelper is a library to work with item texture animations
***
### **Using IAHelper method**
#### **Initialization**
To start working you must import the library.
```js
IMPORT("ItemAnimHelper");
```
***

#### **Converting PC animated item textures into common textures-frames**
```js
IAHelper.convertTexture("assets/images/", "PCTexture", "assets/items-opaque/", "ConvertedTexture");
/*
"assets/images/" - path to the 'tall' texture from the mod directory
"PCTexture" - name of the 'tall' texture without .png
"assets/items-opaque/" - location of result textures, must be "<resource_directory>/items-opaque/"
"ConvertedTexture" - name of the result textures (they will be with different meta and same name)
*/
```
Makes a set of textures-frames from PC 'tall' texture
***

#### **Common item texture animation**
```js
IAHelper.makeCommonAnim(ItemID.myItem, "myTexture", 5, 4);
/*
ItemID.myItem - id of the item you want to animate
"myTexture" - name of your item's texture (you were putting it as resultName in 'convertTexture' function)
5 - how many ticks must pass between changing item texture animation frame
4 - how many frames has the item texture animation
*/
```
Item texture will animate according to interval in ticks
***

#### **Advanced item texture animation**
```js
IAHelper.makeAdvancedAnim(ItemID.myItem, "myTexture", 5, [2, 10, 5, 40, 10]);
/*
ItemID.myItem - id of the item you want to animate
"myTexture" - name of your item's texture (you were putting it as resultName in 'convertTexture' function)
5 - how many frames has the item texture animation
[2, 10, 5, 40, 10] - array of different intervals between which will animate the texture
*/
```
Item texture will animate according to the array of different intervals in ticks
***
### **Downloading the documentation (for Visual Studio Code hints)**
#### - Go to your mod project folder
#### - Move ItemAnimHelper.d.ts to toolchain/jslibs/
#### - Do any task that builds the mod, to update documentation
***
### **INFO**
#### This is the first version of this library, and it has only 3 methods. You can propose new useful methods for textures in VK, and also you can propose your ideas about improvement of library's convenience and customization.
#### [My VK Public](https://www.vk.com/dmhmods)
#### [My VK](https://www.vk.com/vstannumdum)
***
###### © vstannumdum 2020
