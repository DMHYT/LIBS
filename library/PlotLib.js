/// <reference path="../../declarations/core-engine.d.ts" />
/*
██████╗ ██╗      █████╗ ████████╗██╗     ██╗██████╗
██╔══██╗██║     ██╔══██╗╚══██╔══╝██║     ██║██╔══██╗
██████╔╝██║     ██║  ██║   ██║   ██║     ██║██████╦╝
██╔═══╝ ██║     ██║  ██║   ██║   ██║     ██║██╔══██╗
██║     ███████╗╚█████╔╝   ██║   ███████╗██║██████╦╝
╚═╝     ╚══════╝ ╚════╝    ╚═╝   ╚══════╝╚═╝╚═════╝
      █▀▀▄ █  █ 　 ▀█ █▀ █▀▀ █▀▀▄ █  █ █▀▄▀█
      █▀▀▄ █▄▄█ 　  █▄█  ▀▀█ █  █ █  █ █ ▀ █
      ▀▀▀  ▄▄▄█ 　   ▀   ▀▀▀ ▀▀▀   ▀▀▀ ▀   ▀
*/
LIBRARY({
    name: "PlotLib",
    version: 1,
    shared: false,
    api: 'CoreEngine'
});
//by vstannumdum
//VK - https://www.vk.com/vstannumdum
//VK Public - https://www.vk.com/dmhmods
var PlotLib;
(function (PlotLib) {
    /**All registered plots object FOR INTERNAL USE */
    PlotLib.plots = {};
    var CharacterStory = /** @class */ (function () {
        function CharacterStory() {
            this.phrases = [];
        }
        return CharacterStory;
    }());
    PlotLib.CharacterStory = CharacterStory;
    var CharacterDialogue = /** @class */ (function () {
        function CharacterDialogue() {
            this.replicas = [];
        }
        return CharacterDialogue;
    }());
    PlotLib.CharacterDialogue = CharacterDialogue;
    var Character = /** @class */ (function () {
        function Character(name, entityUID, entityName) {
            this.name = name;
            this.entityUID = entityUID;
            this.entityName = entityName;
        }
        Character.prototype.setLine = function (line) {
            this.line = line;
            return this;
        };
        return Character;
    }());
    PlotLib.Character = Character;
    var Line = /** @class */ (function () {
        function Line(name, isNeededForFinal) {
            this.isCompleted = false;
            this.name = name;
            this.isNeededForFinal = isNeededForFinal;
        }
        Line.prototype.setPlot = function (plot) {
            this.plot = plot;
            return this;
        };
        return Line;
    }());
    PlotLib.Line = Line;
    var Plot = /** @class */ (function () {
        function Plot(name) {
            this.lines = [];
            this.name = name;
            PlotLib.plots[this.name] = this;
        }
        Plot.prototype.addLine = function (line) {
            this.lines.push(line.setPlot(this));
            return this;
        };
        return Plot;
    }());
    PlotLib.Plot = Plot;
})(PlotLib || (PlotLib = {}));
Saver.addSavesScope("PlotScope", function (scope) { return PlotLib.plots = scope; }, function () { return PlotLib.plots; });
EXPORT("PlotLib", PlotLib);
