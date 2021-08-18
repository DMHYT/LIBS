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

namespace PlotLib {

    export type PlotsObj = {[key: string]: Plot};

    /**All registered plots object FOR INTERNAL USE */
    export var plots: PlotsObj = {};

    export class CharacterStory {

        private readonly name: string;
        private readonly phrases: string[] = [];
        

    }

    export class CharacterDialogue {

        private readonly name: string;
        private readonly replicas: [string, string][] = [];

        constructor(){
            
        }

    }

    export class Character {

        private readonly name: string;
        private readonly entityUID: number;
        private readonly entityName: string;
        private line: Line;

        public setLine(line: Line): Character {
            this.line = line;
            return this;
        }
        
        constructor(name: string, entityUID: number, entityName: string){
            this.name = name;
            this.entityUID = entityUID;
            this.entityName = entityName;
        }

    }

    export class Line {

        private readonly name: string;
        public readonly isNeededForFinal: boolean;
        public isCompleted: boolean = false;
        private plot: Plot;

        public setPlot(plot: Plot): Line {
            this.plot = plot;
            return this;
        }

        constructor(name: string, isNeededForFinal: boolean){
            this.name = name;
            this.isNeededForFinal = isNeededForFinal;
        }

    }

    export class Plot {

        private readonly name: string;
        private lines: Line[] = [];

        constructor(name: string){
            this.name = name;
            plots[this.name] = this;
        }

        public addLine(line: Line): Plot {
            this.lines.push(line.setPlot(this));
            return this;
        }

    }

}

Saver.addSavesScope("PlotScope", (scope: PlotLib.PlotsObj) => PlotLib.plots = scope, () => PlotLib.plots);

EXPORT("PlotLib", PlotLib);