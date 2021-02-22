/// <reference path="core-engine.d.ts" />
declare var descr: string;
declare namespace HelpingFuncs {
    function replaceImage(from: string, to: string): void;
    function replaceJSON(from: string, to: string): void;
    function getFileFromPath(path: string): string;
}
declare namespace AddonLib {
    var ADDON_NAME: string;
    var RES_PATH: string;
    var BEH_PATH: string;
    var DEFAULT_ENTITY_MATERIAL: string;
    var ENTITY_MODELS_DIR: string;
    var ENTITY_TEXTURES_DIR: string;
    var WAS_INIT: boolean;
    function init(params: {
        [key: string]: any;
    }): void;
    function setAddonIcon(path: string): void;
    function setAddonIconFromModIcon(): void;
    function setEntityModelsDir(path: string): void;
}
declare class AddonMob {
    resOBJ: {
        [key: string]: any;
    };
    behOBJ: {
        [key: string]: any;
    };
    constructor(entityName: string);
    setTexture(path: string): AddonMob;
    setModel(path: string): AddonMob;
    setSpawnEggColor(base: string, overlay: string): AddonMob;
}
