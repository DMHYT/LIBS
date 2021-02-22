/// <reference path="../../declarations/core-engine.d.ts" />

LIBRARY({
    name: "AddonLib",
    version: 1,
    api: 'CoreEngine',
    shared: false
});

var descr: string = "Created with AddonLib for InnerCore 2.0 / Horizon by vstannumdum";

namespace HelpingFuncs {

    export function replaceImage(from: string, to: string): void {
        FileTools.WriteImage(to, FileTools.ReadImage(from));
        new java.io.File(from).delete();
    }

    export function replaceJSON(from: string, to: string): void {
        FileTools.WriteJSON(to, FileTools.ReadJSON(from), true);
        new java.io.File(from).delete();
    }

    export function getFileFromPath(path: string): string {
        if(path.endsWith("/")) return null;
        let p = path.split("/");
        return p[p.length - 1];
    }

}

namespace AddonLib {

    export var ADDON_NAME: string;
    export var RES_PATH: string;
    export var BEH_PATH: string;
    export var DEFAULT_ENTITY_MATERIAL: string;
    export var ENTITY_MODELS_DIR: string;
    export var ENTITY_TEXTURES_DIR: string;
    export var WAS_INIT: boolean = FileTools.ReadJSON(`${__dir__}/addon/addonlib_init.json`)["init"];

    export function init(params: {[key: string]: any}): void {
        if(FileTools.isExists(__dir__ + "/addon/addonlib_init.json") && 
            FileTools.ReadJSON(__dir__ + "/addon/addonlib.init.json")["init"] == true){
            Logger.Log("AddonLib initialization canceled, addon created by lib already exists", "AddonLib DEBUG");
        } else {
            let build = FileTools.ReadJSON(`${__dir__}/build.config`);
            FileTools.mkdir(`${__dir__}/addon/`)
            FileTools.mkdir(`${__dir__}/addon/res-pack/`);
            FileTools.mkdir(`${__dir__}/addon/beh-pack/`);
            build["defaultConfig"]["resourcePacksDir"] = "addon/res-pack/";
            build["defaultConfig"]["behaviourPacksDir"] = "addon/beh-pack";
            FileTools.WriteJSON(`${__dir__}/build.config`, build, true);
            FileTools.mkdir(`${__dir__}/addon/res-pack/${params.name}/`);
            FileTools.mkdir(`${__dir__}/addon/beh-pack/${params.name}/`);
            RES_PATH = `${__dir__}/addon/res-pack/${params.name}/`;
            BEH_PATH = `${__dir__}/addon/beh-pack/${params.name}/`;
            let resourceManifest = {
                "format_version": 1,
                "header": {
                    "uuid": params.resUUID,
                    "name": `${ADDON_NAME}_RES`,
                    "version": [1, 0, 0],
                    "description": descr,
                    "min_engine_version": [1, 11, 0]
                },
                "modules": [
                    {
                        "description": descr,
                        "version": [1, 0, 0],
                        "uuid": params.resModuleUUID,
                        "type": "resources"
                    }
                ],
                "dependencies": [
                    {
                        "uuid": params.behUUID,
                        "version": [1, 0, 0]
                    }
                ]
            };
            let behaviourManifest = {
                "format_version": 1,
                "header": {
                    "uuid": params.behUUID,
                    "name": `${ADDON_NAME}_BEH`,
                    "version": [1, 0, 0],
                    "description": descr,
                    "min_engine_version": [1, 11, 0]
                },
                "modules": [
                    {
                        "description": descr,
                        "version": [1, 0, 0],
                        "uuid": params.behModuleUUID,
                        "type": "data"
                    }
                ],
                "dependencies": [
                    {
                        "uuid": params.resUUID,
                        "version": [1, 0, 0]
                    }
                ]
            }
            FileTools.WriteJSON(`${RES_PATH}manifest.json`, resourceManifest, true);
            FileTools.WriteJSON(`${BEH_PATH}manifest.json`, behaviourManifest, true);
            FileTools.WriteJSON(`${__dir__}/addon/addonlib_init.json`, {"init": true}, true);
        }
    }

    export function setAddonIcon(path: string): void {
        if(FileTools.isExists(`${__dir__}/addon/addonlib_init.json`) && 
            FileTools.ReadJSON(`${__dir__}/addon/addonlib_init.json`)["iconSet"] == true){
            Logger.Log("Setting pack icon to addon, canceled, it already exists", "AddonLib DEBUG");
        } else {
            FileTools.WriteImage(`${RES_PATH}pack_icon.png`, FileTools.ReadImage(`${__dir__}/${path}`));
            FileTools.WriteImage(`${BEH_PATH}pack_icon.png`, FileTools.ReadImage(`${__dir__}/${path}`));
        }
    }

    export function setAddonIconFromModIcon(): void {
        return setAddonIcon("mod_icon.png");
    }

    export function setEntityModelsDir(path: string): void {
        ENTITY_MODELS_DIR = `${__dir__}/${path}`;
    }

}

class AddonMob {

    resOBJ: {[key: string]: any} = {};
    behOBJ: {[key: string]: any} = {};

    constructor(entityName: string){
        if(!AddonLib.WAS_INIT){
            Logger.Log("Failed to create new mob, AddonLib was not initialized. Make it with AddonLib.init method", "AddonLib ERROR");
            return; 
        }
        this.resOBJ = {
            "format_version": "1.10.0",
            "minecraft:client_entity": {
                "description": {
                    "identifier": `${AddonLib.ADDON_NAME.toLowerCase()}:${entityName.toLowerCase()}`
                }
            }
        }
        if(!FileTools.isExists(`${AddonLib.RES_PATH}materials/entity.material`)){
            FileTools.WriteJSON(`${AddonLib.RES_PATH}materials/entity.material`, {
                "materials": {
                    "version": "1.0.0",
                    "mob.entity": {}
                }
            }, true);
        }
        this.resOBJ["minecraft:client_entity"]["description"]["materials"] = {"default": "mob"};
    }

    public setTexture(path: string): AddonMob {
        let textureName = HelpingFuncs.getFileFromPath(path).slice(-4);
        if(FileTools.isExists(`${AddonLib.RES_PATH}textures/entity/${textureName}.png`)){
            Logger.Log("Canceled replacing addon entity texture, it is already exists", "AddonLib DEBUG");
        } else {
            HelpingFuncs.replaceImage(`${__dir__}/${path}.png`, `${AddonLib.RES_PATH}textures/entity/${textureName}.png`);
        }
        this.resOBJ["minecraft:client_entity"]["description"]["textures"] = {};
        this.resOBJ["minecraft:client_entity"]["description"]["textures"]["default"] = `textures/entity/${textureName}`;
        return this;
    }

    public setModel(path: string): AddonMob {
        let fileName = HelpingFuncs.getFileFromPath(path).slice(-5);
        if(FileTools.isExists(`${AddonLib.RES_PATH}models/entity/${fileName}.json`)){
            Logger.Log("Canceled replacing addon entity model, it is already exists", "AddonLib DEBUG");
        } else {
            HelpingFuncs.replaceJSON(path, `${AddonLib.RES_PATH}models/entity/${fileName}.json`);
        }
        this.resOBJ["minecraft:client_entity"]["description"]["geometry"] = {};
        let geo: string = FileTools.ReadJSON(`${AddonLib.RES_PATH}models/entity/${fileName}.json`)["minecraft:geometry"]["description"]["identifier"];
        this.resOBJ["minecraft:client_entity"]["description"]["geometry"]["default"] = geo;
        return this;
    }

    public setSpawnEggColor(base: string, overlay: string): AddonMob {
        this.resOBJ["minecraft:client_entity"]["description"]["spawn_egg"] = {};
        this.resOBJ["minecraft:client_entity"]["description"]["spawn_egg"]["base_color"] = base;
        this.resOBJ["minecraft:client_entity"]["description"]["spawn_egg"]["overlay_color"] = overlay;
        return this;
    }
    
}