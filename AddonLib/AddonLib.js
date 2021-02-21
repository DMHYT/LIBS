LIBRARY({
    name: "AddonLib",
    version: 1,
    api: 'CoreEngine',
    shared: false
});
var descr = "Created with AddonLib for InnerCore 2.0 / Horizon by vstannumdum";
var AddonLib;
(function (AddonLib) {
    var ADDON_NAME;
    var RES_PATH;
    var BEH_PATH;
    function init(params) {
        if (FileTools.isExists(__dir__ + "/addon/addonlib_init.json") &&
            FileTools.ReadJSON(__dir__ + "/addon/addonlib.init.json")["init"] == true) {
            Logger.Log("AddonLib initialization canceled, addon created by lib already exists", "AddonLib DEBUG");
        }
        else {
            var build = FileTools.ReadJSON(__dir__ + "/build.config");
            FileTools.mkdir(__dir__ + "/addon/");
            FileTools.mkdir(__dir__ + "/addon/res-pack/");
            FileTools.mkdir(__dir__ + "/addon/beh-pack/");
            build["defaultConfig"]["resourcePacksDir"] = "addon/res-pack/";
            build["defaultConfig"]["behaviourPacksDir"] = "addon/beh-pack";
            FileTools.WriteJSON(__dir__ + "/build.config", build, true);
            FileTools.mkdir(__dir__ + "/addon/res-pack/" + params.name + "/");
            FileTools.mkdir(__dir__ + "/addon/beh-pack/" + params.name + "/");
            RES_PATH = __dir__ + "/addon/res-pack/" + params.name + "/";
            BEH_PATH = __dir__ + "/addon/beh-pack/" + params.name + "/";
            var resourceManifest = {
                "format_version": 1,
                "header": {
                    "uuid": params.resUUID,
                    "name": ADDON_NAME + "_RES",
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
            var behaviourManifest = {
                "format_version": 1,
                "header": {
                    "uuid": params.behUUID,
                    "name": ADDON_NAME + "_BEH",
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
            };
            FileTools.WriteJSON(RES_PATH + "manifest.json", resourceManifest, true);
            FileTools.WriteJSON(BEH_PATH + "manifest.json", behaviourManifest, true);
            FileTools.WriteJSON(__dir__ + "/addon/addonlib_init.json", { "init": true }, true);
        }
    }
    AddonLib.init = init;
})(AddonLib || (AddonLib = {}));
